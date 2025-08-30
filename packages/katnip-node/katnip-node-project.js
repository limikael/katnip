import path from "node:path";
import {AsyncEvent, DeclaredError} from "../../src/exports/exports-default.js";
import KatnipNodeServer from "./KatnipNodeServer.js";
import {fileURLToPath} from 'url';
import {importWorker} from "../../src/utils/import-worker.js";
import fs, {promises as fsp} from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

initCli.priority=5;
export function initCli(ev) {
	//ev.target.eventCommand("build").description("Build project.");

	ev.target.eventCommand("start")
		.description("Start server for production.")
		.defaultMode("prod")
		.option("--port <port>","Port to listen to.",3000)
		.option("--provision","Run provision before serving.")
		.option("--build","Run build before serving, otherwise requires a previous build.");

	ev.target.eventCommand("dev")
		.description("Start development server.")
		.defaultMode("dev")
		.option("--port <port>","Port to listen to.",3000)
		.option("--platform <platform>","Dev platform.")
		.option("--no-provision","Don't run provision as part of the build.");

	ev.target.eventCommand("build")
		.description("Build project.")
		.defaultMode("prod")
		.option("--platform <platform>","Build for platform.")
		.option("--mode <mode>","Specify mode (prod/dev).");

	ev.target.eventCommand("deploy")
		.description("Deploy project.")
		.defaultMode("prod")
		.option("--no-build","Don't build, requires a previous build.")
		.option("--no-provision","Don't run provision as part of the deploy.")
		.option("--platform <platform>","Deploy to platform.");

	ev.target.eventCommand("provision")
		.description("Provision project, i.e. migrate database, etc.")
		.defaultMode("prod")
		.option("--platform <platform>","Provision platform.")
		.option("--mode <mode>","Specify mode (prod/dev).");
}

init.priority=5;
export async function init(ev) {
	let project=ev.target;
	let pkg=await project.processProjectFile("package.json","json",async pkg=>{
		if (!pkg)
			pkg={};

		if (!pkg.name)
			pkg.name=path.basename(project.cwd);

		ev.target.log("Initializing project: "+pkg.name);

		pkg.type="module";

		if (!pkg.scripts)
			pkg.scripts={};

		if (!pkg.scripts.dev)
			pkg.scripts.dev="katnip dev";

		if (!pkg.dependencies)
			pkg.dependencies={};

		if (!pkg.dependencies.katnip)
			pkg.dependencies.katnip="^"+await project.getKatnipVersion();

		return pkg;
	});

	await project.processProjectFile(".gitignore","lines",async ignore=>{
		if (!ignore)
			ignore=[];

		if (!ignore.includes("node_modules"))
			ignore.push("node_modules");

		if (!ignore.includes("upload"))
			ignore.push("upoad");

		if (!ignore.includes("quickmin.db"))
			ignore.push("quickmin.db");

		if (!ignore.includes(".target"))
			ignore.push(".target");

		return ignore;
	});
}

export async function build(ev) {
	if (ev.target.platform!="node")
		return;

	ev.env.CWD=ev.target.cwd;
}

saveBuild.event="build";
saveBuild.priority=20;
export async function saveBuild(ev) {
	if (ev.target.platform!="node" ||
			ev.save===false)
		return;

	let buildData={
		modulePaths: await ev.target.resolveEntrypoints("katnip-server-hooks"),
		importModulePaths: ev.importModules,
		env: ev.getRuntimeEnv(),
	}

	await fsp.mkdir(path.join(ev.target.cwd,".target"),{recursive: true});
	await fsp.writeFile(path.join(ev.target.cwd,".target/node-build.json"),JSON.stringify(buildData,null,2));
}

dev.priority=5;
export async function dev(ev) {
	let start=Date.now();
	let project=ev.target;

	if (project.mode!="dev")
		throw new DeclaredError("Dev requires dev mode");

	let workerPromise;
	if (project.platform=="node")
		workerPromise=importWorker(path.join(__dirname,"katnip-node-dev-worker.js"));

	let buildEvent=new AsyncEvent("build",{save: false});
	await project.dispatchEvent(buildEvent/*,{concurrent: true}*/);

	project.log(`Build complete (${(Date.now()-start)/1000}s)`);

	if (ev.provision)
		await project.dispatchEvent(new AsyncEvent("provision",{local: true}));

	if (project.platform=="node") {
		let worker=await workerPromise;

		let env=buildEvent.getRuntimeEnv();
		await worker.start({
			modulePaths: await ev.target.resolveEntrypoints("katnip-server-hooks"),
			importModulePaths: buildEvent.importModules,
			env: env,
			port: ev.port,
			testScheduled: true,
			cron: env.config.cron
		});

		let duration=Date.now()-start;
		project.log(`Started (${duration/1000}s), Listen: ${ev.port}`);

		async function stop() {
			await worker.terminate();
		}

		return {stop};
	}
}

deploy.priority=5;
export async function deploy(ev) {
	let project=ev.target;

	if (project.platform=="node")
		throw new DeclaredError("Nothing to deploy for node.");

	if (ev.build)
		await project.dispatchEvent(new AsyncEvent("build"));

	if (ev.provision)
		await project.dispatchEvent(new AsyncEvent("provision",{remote: true}));
}

export async function start(ev) {
	if (ev.target.platform!="node")
		throw new Error("Can only serve node");

	if (!ev.port)
		throw new Error("No port specified");

	let project=ev.target;
	if (ev.build)
		await project.dispatchEvent(new AsyncEvent("build"));

	if (ev.provision)
		await project.dispatchEvent(new AsyncEvent("provision"));

	let artifactPath=path.join(ev.target.cwd,".target/node-build.json");
	if (!fs.existsSync(artifactPath))
		throw new DeclaredError("No previous build to serve.");

	let artifact=JSON.parse(await fsp.readFile(artifactPath));

	let server=new KatnipNodeServer({
		modulePaths: artifact.modulePaths,
		importModulePaths: artifact.importModulePaths,
		env: artifact.env,
		port: ev.port,
		cron: artifact.env.config.cron
	});

	await server.start();
	project.log("Listen: "+ev.port);

	async function stop() {
		await server.stop();
	}

	return {stop};
}
