import path from "node:path";
import {AsyncEvent} from "../../src/exports/exports-default.js";
import KatnipNodeServer from "./KatnipNodeServer.js";
import {fileURLToPath} from 'url';
import {importWorker} from "../../src/utils/import-worker.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

initCli.priority=5;
export function initCli(ev) {
	//ev.target.eventCommand("build").description("Build project.");

	ev.target.eventCommand("serve")
		.description("Serve project.")
		.option("--port <port>","Port to listen to.",3000)
		.option("--provision","Run provision as part of the build.");

	ev.target.eventCommand("dev")
		.description("Start development server.")
		.option("--port <port>","Port to listen to.",3000)
		.option("--no-provision","Don't run provision as part of the build.");

	ev.target.eventCommand("provision")
		.description("Provision project, i.e. migrate database, etc.");
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

		return pkg;
	});
}

export async function build(ev) {
	if (ev.target.platform!="node")
		return;

	ev.env.CWD=ev.target.cwd;
}

dev.priority=5;
export async function dev(ev) {
	let start=Date.now();
	let project=ev.target;

	let workerPromise;
	if (project.platform=="node")
		workerPromise=importWorker(path.join(__dirname,"katnip-node-dev-worker.js"));

	let buildEvent=new AsyncEvent("build");
	await project.dispatchEvent(buildEvent);

	if (ev.provision)
		await project.dispatchEvent(new AsyncEvent("provision"));

	if (project.platform=="node") {
		let worker=await workerPromise;

		await worker.start({
			modulePaths: await ev.target.resolveEntrypoints("katnip-server-hooks"),
			importModulePaths: buildEvent.importModules,
			env: {...buildEvent.env},
			port: ev.port
		});

		let duration=Date.now()-start;
		project.log(`Started (${duration/1000}s), Listen: ${ev.port}`);

		async function stop() {
			await worker.terminate();
		}

		return {stop};
	}
}

export async function serve(ev) {
	if (ev.target.platform!="node")
		throw new Error("Can only serve node");

	if (!ev.port)
		throw new Error("No port specified");

	let project=ev.target;
	let buildEvent=new AsyncEvent("build");
	await project.dispatchEvent(buildEvent);

	if (ev.provision)
		await project.dispatchEvent(new AsyncEvent("provision"));

	let server=new KatnipNodeServer({
		modulePaths: await ev.target.resolveEntrypoints("katnip-server-hooks"),
		importModulePaths: buildEvent.importModules,
		env: buildEvent.env,
		port: ev.port
	});

	await server.start();
	project.log("Listen: "+ev.port);

	async function stop() {
		await server.stop();
	}

	return {stop};
}
