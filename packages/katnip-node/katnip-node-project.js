import path from "node:path";
import http from "node:http";
import {KatnipServer, AsyncEvent} from "../../src/exports/exports-default.js";
import {serverListenPromise, serverClosePromise, createStaticResponse} from "../../src/utils/node-util.js";
import {createNodeRequestListener} from "serve-fetch";

export function initCli(ev) {
	//ev.target.eventCommand("build").description("Build project.");

	ev.target.eventCommand("serve")
		.description("Serve project.")
		.option("--port <port>","Port to listen to.",3000)
		.option("--provision","Run provision as part of the build.");

	ev.target.eventCommand("dev")
		.description("Start development server.")
		.option("--port <port>","Port to listen to.",3000)
		.option("--provision","Run provision as part of the build.",true);

	ev.target.eventCommand("provision")
		.description("Provision project, i.e. migrate database, etc.");
}

export async function dev(ev) {
	let serveEvent=new AsyncEvent("serve",ev);
	await ev.target.dispatchEvent(serveEvent);
}

export async function serve(ev) {
	if (ev.target.platform!="node")
		return;

	if (!ev.port)
		throw new Error("No port specified");

	let project=ev.target;
	let buildEvent=new AsyncEvent("build");
	await project.dispatchEvent(buildEvent);

	if (ev.provision) {
		let provisionEvent=new AsyncEvent("provision");
		await project.dispatchEvent(provisionEvent);
	}

	let modulesPaths=await ev.target.resolveEntrypoints("katnip-server-hooks");
	let modules=await Promise.all(modulesPaths.map(p=>import(p)));

	let importModules={}
	for (let k in buildEvent.importModules)
		importModules[k]=await import(buildEvent.importModules[k]);

	let server=new KatnipServer({
		modules,
		importModules,
		env: buildEvent.env,
		cwd: project.cwd,
		config: project.config
	});

	let listener=createNodeRequestListener(async request=>{
		let assetResponse=await createStaticResponse({
			request: request,
			cwd: path.join(project.cwd,"public")
		});

		if (assetResponse)
			return assetResponse;

		return await server.handleRequest({request});
	});

	let httpServer=http.createServer(listener);
	await serverListenPromise(httpServer,ev.port);

	await project.log("Listening to port: "+ev.port);

	async function stop() {
		await serverClosePromise(httpServer);
	}

	return {stop};
}

export async function init(ev) {
	let project=ev.target;
	await project.processProjectFile("package.json","json",async pkg=>{
		if (!pkg)
			pkg={};

		if (!pkg.name)
			pkg.name=path.basename(project.cwd);

		return pkg;
	});
}