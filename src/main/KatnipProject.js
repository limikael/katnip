import fs, {promises as fsp} from "node:fs";
import path from "node:path";
import {DeclaredError} from "../utils/js-util.js";
import JSON5 from "json5";
import {isoqBundle} from "isoq/bundler";
import {mikrokatServe, mikrokatBuild, mikrokatCreateProvisionEnv} from "mikrokat";
import {fileURLToPath} from 'node:url';
import {tailwindBuild} from "../utils/tailwind-util.js";
import {quickminCanonicalizeConf, QuickminServer} from "quickmin/server";
import {QqlDriverSqlite} from "quickmin/qql";
import sqlite3 from "sqlite3";
import nodeStorageDriver from "quickmin/node-storage";
import {arrayify} from "../utils/js-util.js";
import esbuild from "esbuild";
import {esbuildModuleAlias} from "isoq/esbuild-util";
import {createQqlDriver, createStorageDriver} from "./create-drivers.js";
import QqlDriverWrangler from "quickmin/qql-wrangler-driver";
import {MockStorage} from "quickmin/mock-storage";
import {findNodeBin} from "../utils/node-util.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

export default class KatnipProject {
	constructor({cwd, quiet, target, local, remote}) {
		this.cwd=cwd;
		this.quiet=quiet;
		this.target=target;

		if (!this.target)
			this.target="node";

		this.local=local;
		this.remote=remote;
	}

	async init() {
		throw new DeclaredError("init is wip")
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

	async build() {
		if (!this.config)
			throw new Error("Config not loaded");

		console.log("Building for "+this.target+"...");

		let tasks=[];
		let wrappers=[
			path.join(__dirname,"../wrappers/QuickminWrapper.jsx"),
		];

		if (this.config["admin-client-functions"]) {
			tasks.push(esbuild.build({
				entryPoints: [path.resolve(this.cwd,this.config["admin-client-functions"])],
				format: "esm",
				jsx: 'automatic',
				jsxImportSource: 'preact',
				outfile: path.join(this.cwd,"public","admin-client-functions.js"),
				plugins: [
					esbuildModuleAlias({
						"react": "preact/compat",
						"react-dom": "preact/compat",
						"react/jsx-runtime": "preact/jsx-runtime"
					})
				],
				bundle: true
			}));
		}

		wrappers.push(path.join(__dirname,"../wrappers/TailwindWrapper.jsx"))
		tasks.push(tailwindBuild({
			cwd: this.cwd,
			config: path.join(this.cwd,"tailwind.config.cjs"),
			out: path.join(this.cwd,"public/index.css")
		}));

		if (this.config["rpc-api"])
			wrappers.push(path.join(__dirname,"../wrappers/RpcWrapper.jsx"));

		tasks.push(isoqBundle({
			entrypoint: path.resolve(this.cwd,this.config.client),
			out: path.resolve(this.cwd,".target/isoq-request-handler.js"),
			wrappers: wrappers,
			quiet: true
		}));

		await Promise.all(tasks);

		await mikrokatBuild({
			cwd: this.cwd,
			config: this.getMikrokatConfig(),
			quiet: this.quiet,
			target: this.target,
			env: this.getRuntimeEnv()
		});
	}

	getMikrokatConfig() {
		if (!this.config)
			throw new Error("config not loaded");

		let main=[path.join(__dirname,"server.js")];
		main.push(...arrayify(this.config.main).map(m=>path.resolve(this.cwd,m)));

		let imports=[];

		imports.push({import: "isoqRequestHandler", from: "./.target/isoq-request-handler.js"});

		if (this.config["rpc-api"])
			imports.push({import: "RpcApi", from: path.resolve(this.cwd,this.config["rpc-api"])});

		return ({
			main: main,
			imports: imports,
			services: this.config.services
		});
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

		console.log("Provisioning "+this.target+dest+"...");

		let env=await mikrokatCreateProvisionEnv({
			cwd: this.cwd,
			target: this.target,
			config: this.getMikrokatConfig()
		});

		let quickminConf=quickminCanonicalizeConf(fs.readFileSync(path.join(this.cwd,"quickmin.yaml"),"utf8"));

		if (this.target=="cloudflare") {
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

	async serve() {
		if (!this.config)
			throw new Error("Config not loaded");

		await this.build();
		await this.provision();

		await mikrokatServe({
			cwd: this.cwd,
			port: 3000,
			config: this.getMikrokatConfig(),
			quiet: this.quiet,
			env: this.getRuntimeEnv()
		});
	}
}