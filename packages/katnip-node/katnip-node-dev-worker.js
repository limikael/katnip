import KatnipNodeServer from "./KatnipNodeServer.js";

let server;

export async function start({modulePaths, importModulePaths, env, port, testScheduled, cron}) {
	server=new KatnipNodeServer({
		modulePaths,
		importModulePaths,
		env,
		port,
		testScheduled,
		cron
	});

	await server.start();
}

export async function terminate() {
	await server.stop();
}