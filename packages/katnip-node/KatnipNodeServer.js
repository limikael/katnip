import {serverListenPromise, serverClosePromise, createStaticResponse} from "../../src/utils/node-util.js";
import {urlGetArgs, urlGetParams, arrayify} from "../../src/utils/js-util.js";
import {createNodeRequestListener} from "serve-fetch";
import http from "node:http";
import {KatnipServer} from "../../src/exports/exports-default.js";
import path from "node:path";
import cron from "node-cron";

export default class KatnipNodeServer {
	constructor({modulePaths, importModulePaths, port, env, testScheduled, cron}) {
		this.modulePaths=modulePaths;
		this.importModulePaths=importModulePaths;
		this.port=port;
		this.testScheduled=testScheduled;
		this.env={...env,...process.env};
		this.cron=arrayify(cron);
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

		//console.log("started, cron=",this.cron);

		this.tasks=[];
		for (let taskCron of this.cron)
			this.tasks.push(cron.schedule(taskCron,async ()=>{
				await server.handleScheduled({cron: taskCron});
			}));

		let listener=createNodeRequestListener(async request=>{
			let urlArgs=urlGetArgs(request.url);
			let urlParams=urlGetParams(request.url);

			if (urlArgs.length==1 && 
					urlArgs[0]=="__scheduled" &&
					this.testScheduled) {
				await server.handleScheduled({cron: urlParams.cron});
				return new Response("emulated cron run successfully\n");
			}

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

		for (let task of this.tasks)
			task.stop();

		this.tasks=[];
	}
}