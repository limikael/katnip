import KatnipNodeServer from "./KatnipNodeServer.js";

let server;

export async function start({modulePaths, importModulePaths, env, cwd, config, port}) {
	server=new KatnipNodeServer({
		modulePaths,
		importModulePaths,
		env,
		cwd,
		config,
		port
	});

	await server.start();
}

export async function terminate() {
	await server.stop();
}