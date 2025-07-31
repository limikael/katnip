import {serverListenPromise, serverClosePromise, createStaticResponse} from "../../src/utils/node-util.js";
import {createNodeRequestListener} from "serve-fetch";
import http from "node:http";
import {KatnipServer} from "../../src/exports/exports-default.js";
import path from "node:path";

export default class KatnipNodeServer {
	constructor({modulePaths, importModulePaths, port, env}) {
		this.modulePaths=modulePaths;
		this.importModulePaths=importModulePaths;
		this.port=port;
		this.env={...env,...process.env};
	}

	async start() {
		let modules=await Promise.all(this.modulePaths.map(p=>import(p)));

		let importModules={}
		for (let k in this.importModulePaths)
			importModules[k]=await import(this.importModulePaths[k]);

		let server=new KatnipServer({
			modules,
			importModules,
			env: this.env,
		});

		await server.start();

		let listener=createNodeRequestListener(async request=>{
			let assetResponse=await createStaticResponse({
				request: request,
				cwd: path.join(this.env.CWD,"public")
			});

			if (assetResponse)
				return assetResponse;

			return await server.handleRequest({request});
		});

		this.httpServer=http.createServer(listener);
		await serverListenPromise(this.httpServer,this.port);
	}

	async stop() {
		await serverClosePromise(this.httpServer);
		this.httpServer=null;
	}
}