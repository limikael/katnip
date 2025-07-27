import {AsyncEventTarget, AsyncEvent} from "../utils/async-events.js";

export default class KatnipServer extends AsyncEventTarget {
	constructor({modules, importModules, env, config, cwd}) {
		super();

		for (let mod of modules)
			this.addListenerModule(mod);

		this.importModules=importModules;
		this.env={...env};
		this.config=config;
		this.cwd=cwd;
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

	async handleRequest({request, ctx}) {
		try {
			await this.start();

			let localFetch=()=>{throw new Error("fix local fetch")};

			let ev=new AsyncEvent("fetch",{request, ctx, localFetch});
			return await this.dispatchEvent(ev);
		}

		catch (e) {
			console.log(e);
			throw e;
		}
	}
}