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

	handleRequest=async({request, ctx})=>{
		try {
			await this.start();

			let ev=new AsyncEvent("fetch",{
				request, 
				ctx,
				localFetch: request=>this.handleRequest({request,ctx})
			});

			return await this.dispatchEvent(ev);
		}

		catch (e) {
			console.log(e);
			throw e;
		}
	}
}