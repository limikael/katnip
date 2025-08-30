import {AsyncEventTarget, AsyncEvent} from "../utils/async-events.js";

export default class KatnipServer extends AsyncEventTarget {
	constructor({modules, importModules, env}) {
		super();

		for (let mod of modules)
			this.addListenerModule(mod);

		this.importModules=importModules;
		this.env=env;

		this.addEventListener("*",ev=>{
			ev.env=this.env;
		},{priority: 0});
	}

	async start() {
		if (!this.startPromise) {
			this.startPromise=new Promise(async (resolve, reject)=>{
				try {
					let ev=new AsyncEvent("start");
					await this.dispatchEvent(ev);
				}

				catch (e) {
					reject(e);
				}

				resolve();
			});
		}

		return await this.startPromise;
	}

	createLocalFetch({request, ctx}) {
		let localFetch=async (requestOrUrl, options={})=>{
			if (requestOrUrl instanceof Request)
				return await this.handleRequest({request: requestOrUrl, ctx: ctx});

			//console.log("constructing url from: "+requestOrUrl);
			let requestUrl=new URL(request.url);
			let url=new URL(requestOrUrl,requestUrl.origin);
			//console.log("fetching from: "+url);

			let localRequest=new Request(url, options);
			return await this.handleRequest({request: localRequest, ctx: ctx});
		}

		return localFetch;
	}

	handleRequest=async({request, ctx})=>{
		try {
			await this.start();

			let ev=new AsyncEvent("fetch",{
				request,
				ctx,
				localFetch: this.createLocalFetch({request,ctx}),
			});

			return await this.dispatchEvent(ev);
		}

		catch (e) {
			//console.log(e);
			return new Response(e.message,{status: 500, headers: {"content-type": "text/html"}});
			//throw e;
		}
	}

	handleScheduled=async({cron})=>{
		await this.start();
		let ev=new AsyncEvent("scheduled",{
			cron
		});

		await this.dispatchEvent(ev);
	}
}