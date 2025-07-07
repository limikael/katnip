import fs, {promises as fsp} from "node:fs";
import path from "node:path";
import {DeclaredError, objectMerge} from "../utils/js-util.js";
import JSON5 from "json5";
import {isoqBundle, isoqGetEsbuildOptions} from "isoq/bundler";
import {mikrokatServe, mikrokatBuild, mikrokatCreateProvisionEnv, mikrokatInit, processProjectFile, mikrokatDeploy} from "mikrokat";
import {fileURLToPath} from 'node:url';
import {tailwindBuild} from "../utils/tailwind-util.js";
import {quickminCanonicalizeConf, QuickminServer} from "quickmin/server";
import nodeStorageDriver from "quickmin/node-storage";
import {arrayify} from "../utils/js-util.js";
import esbuild from "esbuild";
import {createQqlDriver, createStorageDriver} from "./create-drivers.js";
import QqlDriverWrangler from "quickmin/qql-wrangler-driver";
import {QqlDriverBetterSqlite3} from "quickmin/qql";
import {MockStorage} from "quickmin/mock-storage";
import {findNodeBin, getPackageVersion} from "../utils/node-util.js";
import {SERVER_JS, INDEX_JSX, QUICKMIN_YAML, TAILWIND_CONFIG_CJS} from "./stubs.js";
import {cloudflareGetBinding, cloudflareAddBinding} from "../utils/cloudflare-util.js";
import {loadPlugins} from "../utils/plugins.js";
import BuildEvent from "./BuildEvent.js";
import {startFileWatcher} from "../utils/file-watcher.js";
import {resolveImport} from "mikrokat/resolve-import";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

export default class KatnipProject {
	constructor({cwd, quiet, platform, local, remote, log, watch}) {
		this.cwd=cwd;
		this.quiet=quiet;
		this.platform=platform;

		if (!this.platform)
			this.platform="node";

		this.local=local;
		this.remote=remote;
		this.watch=watch;

		if (typeof log=="function")
			this.log=log;

		else if (log!==false)
			this.log=(...args)=>console.log(...args);

		else
			this.log=()=>{};
	}

	async init() {
		if (!this.cwd)
			throw new Error("Need cwd!");

		let projectName=path.basename(this.cwd);

		await this.processProjectFile("package.json","json",async pkg=>{
			if (!pkg) {
				this.log("Initializing new katnip project: "+path.basename(this.cwd));
				await fsp.mkdir(this.cwd,{recursive: true});
			}

			return objectMerge({
				name: projectName,
				private: true,
				type: "module",
				scripts: {
					start: "katnip serve",
					build: "katnip build"
				},
				dependencies: {
					katnip: "^"+await getPackageVersion(__dirname),
					"better-sqlite3": "^12.2.0"
				}
			},pkg);
		});

		await this.processProjectFile("katnip.json","json",async katnip=>{
			return objectMerge(katnip,{
				server: "src/main/server.js",
				client: "src/main/index.jsx",
				services: {
					DB: {
						type: "better-sqlite3",
						filename: "quickmin.db",
						if: {platform: "node"}
					}
				}
			},katnip);
		});

		await this.load();

		await this.processProjectFile(this.config.server,null,async src=>{
			if (!src)
				return SERVER_JS;
		});

		await this.processProjectFile(this.config.client,null,async src=>{
			if (!src)
				return INDEX_JSX;
		});

		await this.processProjectFile("quickmin.yaml",null,async src=>{
			if (!src)
				return QUICKMIN_YAML;
		});

		await this.processProjectFile("tailwind.config.cjs",null,async src=>{
			if (!src)
				return TAILWIND_CONFIG_CJS;
		});

		await mikrokatInit({
			cwd: this.cwd,
			platform: this.platform,
			initProject: false,
			log: this.log
		});

		if (this.platform=="cloudflare") {
			await this.processProjectFile("wrangler.json","json",async wrangler=>{
				if (!cloudflareGetBinding(wrangler,"DB")) {
					cloudflareAddBinding(wrangler,"d1_databases",{
						binding: "DB",
						database_name: projectName,
						database_id: "undefined",
						preview_database_id: projectName
					});
				}

				if (!cloudflareGetBinding(wrangler,"BUCKET")) {
					cloudflareAddBinding(wrangler,"r2_buckets",{
						binding: "BUCKET",
						bucket_name: "undefined",
						preview_bucket_name: projectName
					});
				}
			});
		}
	}

	async processProjectFile(filename, format, processor) {
		let content=await processProjectFile({
			cwd: this.cwd,
			filename,
			format,
			processor
		});

		if (["katnip.json","package.json"].includes(filename))
			this.config=undefined;

		return content;
	}

	async load() {
		this.config={};

		if (!fs.existsSync(path.join(this.cwd,"katnip.json")))
			throw new DeclaredError("No katnip.json file.");

		this.config={
			...this.config,
			...JSON5.parse(await fsp.readFile(path.join(this.cwd,"katnip.json")))
		}
	}

	getMikrokatConfig(buildEvent) {
		if (!this.config)
			throw new Error("config not loaded");

		let main=[path.join(__dirname,"server.js")];
		main.push(...arrayify(this.config.main).map(m=>path.resolve(this.cwd,m)));
		main.push(...buildEvent.serverModules);

		let imports=[];

		imports.push({import: ["localNodeBundle"], from: "katnip/quickmin-local-node-bundle", if: {platform: "node"}});

		imports.push({import: "isoqRequestHandler", from: "./.target/isoq-request-handler.js"});

		if (this.config["rpc-api"])
			imports.push({import: "RpcApi", from: path.resolve(this.cwd,this.config["rpc-api"])});

		if (this.config.server)
			main.push(path.resolve(this.cwd,this.config.server));

		return ({
			main: main,
			imports: imports,
			services: this.config.services,
			env: this.config.env
		});
	}

	async build() {
		if (!this.config)
			throw new Error("Config not loaded");

		console.log("Building for "+this.platform+"...");
		if (!this.pluginTarget) {
			this.pluginTarget=await loadPlugins({
				cwd: this.cwd,
				keyword: "katnip-plugin",
				export: "katnip-build"
			});
		}

		let buildEvent=new BuildEvent();
		await this.pluginTarget.dispatch(buildEvent);

		//console.log(buildEvent.serverModules);

		let tasks=[];
		let wrappers=[
			path.join(__dirname,"../wrappers/QuickminWrapper.jsx"),
		];

		if (this.config["admin-client-functions"]) {
			let preactPath="/home/micke/Repo/isoq/node_modules/preact";

			tasks.push(esbuild.build({
				...await isoqGetEsbuildOptions(),
				entryPoints: [path.resolve(this.cwd,this.config["admin-client-functions"])],
				outfile: path.join(this.cwd,"public","admin-client-functions.js"),
				minify: true,
				//outdir: path.join(this.cwd,"public"),//,"admin-client-functions.js"),
				//splitting: true,
				//chunkNames: "xxx-[name]-[hash]"
			}));
		}

		wrappers.push(path.join(__dirname,"../wrappers/TailwindWrapper.jsx"))
		tasks.push(tailwindBuild({
			cwd: this.cwd,
			config: path.join(this.cwd,"tailwind.config.cjs"),
			out: path.join(this.cwd,"public/index.css"),
			input: this.config.tailwindInput
		}));

		if (this.config["rpc-api"])
			wrappers.push(path.join(__dirname,"../wrappers/RpcWrapper.jsx"));

		wrappers.push(...buildEvent.clientWrappers);

		let clientPurgeOldJs=this.config.clientPurgeOldJs;
		if (clientPurgeOldJs===undefined)
			clientPurgeOldJs=true;

		tasks.push(isoqBundle({
			entrypoint: path.resolve(this.cwd,this.config.client),
			out: path.resolve(this.cwd,".target/isoq-request-handler.js"),
			contentdir: path.resolve(this.cwd,"public"),
			wrappers: wrappers,
			quiet: true,
			splitting: this.config.clientSplitting,
			purgeOldJs: clientPurgeOldJs
		}));

		await Promise.all(tasks);

		await mikrokatBuild({
			cwd: this.cwd,
			config: this.getMikrokatConfig(buildEvent),
			quiet: this.quiet,
			platform: this.platform,
			env: this.getRuntimeEnv(),
			log: this.log
		});

		return buildEvent;
	}

	async createProvisionEnv() {
		if (!this.config)
			throw new Error("Config not loaded");

		if (this.local && this.remote)
			throw new DeclaredError("Can't provision both local and remote");

		let dest="";
		if (this.local)
			dest=" (local)";

		if (this.remove)
			dest=" (remote)";

		console.log("Provisioning "+this.platform+dest+"...");

		let env=await mikrokatCreateProvisionEnv({
			cwd: this.cwd,
			platform: this.platform,
			config: {services: this.config.services} //this.getMikrokatConfig()
		});

		let quickminConf=quickminCanonicalizeConf(fs.readFileSync(path.join(this.cwd,"quickmin.yaml"),"utf8"));

		if (this.platform=="cloudflare") {
			quickminConf.qqlDriver=new QqlDriverWrangler({
				d1Binding: "DB",
				local: true,
				wranglerJsonPath: path.join(this.cwd,"wrangler.json"),
				wranglerBin: await findNodeBin({cwd: this.cwd, name: "wrangler"}),
				local: this.local,
				remote: this.remote
			});
			quickminConf.storageDriver=new MockStorage();
		}

		else {
			quickminConf.qqlDriver=createQqlDriver(env.DB,env.getServiceMeta("DB").type);
		}

		if (env.BUCKET)
			quickminConf.storageDriver=createStorageDriver(env.BUCKET,env.getServiceMeta("BUCKET").type);

		env.qm=new QuickminServer(quickminConf);
		env.qql=env.qm.qql;

		return env;
	}

	async createTestEnv() {
		if (!this.config)
			throw new Error("Config not loaded");

		let betterSqlite3Path=await resolveImport("better-sqlite3",this.cwd);
		let BetterSqlite3Database=(await import(betterSqlite3Path)).default;

		let env={
			DB: new BetterSqlite3Database(":memory:")
		};

		let quickminConf=quickminCanonicalizeConf(fs.readFileSync(path.join(this.cwd,"quickmin.yaml"),"utf8"));
		quickminConf.qqlDriver=new QqlDriverBetterSqlite3(env.DB);
		quickminConf.storageDriver=new MockStorage();

		env.qm=new QuickminServer(quickminConf);
		env.qql=env.qm.qql;

		await env.qql.migrate({log: ()=>{}});

		return env;
	}

	async provision() {
		if (!this.config)
			throw new Error("Config not loaded");

		let env=await this.createProvisionEnv();

		await env.qql.migrate();
	}

	getRuntimeEnv() {
		let quickminConf=quickminCanonicalizeConf(fs.readFileSync(path.join(this.cwd,"quickmin.yaml"),"utf8"));

		if (this.config["admin-client-functions"])
			quickminConf.clientImports.push("/admin-client-functions.js");

		return ({
			__QUICKMIN_CONF: quickminConf
		})
	}

	async startServer({worker}={}) {
		let started=Date.now();

		let buildEvent=await this.build();
		await this.provision();
		let server=await mikrokatServe({
			cwd: this.cwd,
			port: 3000,
			config: this.getMikrokatConfig(buildEvent),
			log: this.log,
			env: this.getRuntimeEnv(),
			platform: this.platform,
			worker: worker
		});

		let durationSec=(Date.now()-started)/1000;
		this.log(`Started (${durationSec}sec).`);

		return server;
	}

	async serveWatch() {
		let watchPaths=this.config.watchPaths;
		if (!watchPaths)
			watchPaths=["src"];

		watchPaths=watchPaths.map(p=>path.join(this.cwd,p));

		let watcher=startFileWatcher({
			directories: watchPaths
		});

		while (1) {
			await this.load();
			let server;

			try {
				server=await this.startServer({worker: true});
			}

			catch (e) {
				if (!e.message.includes("Build failed") ||
						!e.errors)
					throw e;
			}

			await watcher.wait();

			if (server)
				await server.stop();
		}
	}

	async serve() {
		this.local=true;
		await this.load();

		if (this.watch)
			await this.serveWatch();

		return await this.startServer();
	}

	async deploy() {
		this.remote=true;
		await this.load();

		let buildEvent=await this.build();
		await this.provision();

		await mikrokatDeploy({
			cwd: this.cwd,
			config: this.getMikrokatConfig(buildEvent),
			log: this.log,
			env: this.getRuntimeEnv(),
			platform: this.platform,
		});
	}
}