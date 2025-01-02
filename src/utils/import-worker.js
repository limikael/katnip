import {Worker} from "worker_threads";
import {awaitEvent} from "./js-util.js";

let WORKER_STUB=`
	(async function main() {
		let mod=await import(@path@);
		let {workerData, parentPort}=await import("worker_threads");
		parentPort.postMessage({type: "ready", keys: Object.keys(mod)});
		parentPort.on("message",async ev=>{
			if (ev.type!="call")
				throw new Error("Expected mesage of call type");

			try {
				let res=await mod[ev.method](...ev.params);
				parentPort.postMessage({
					type: "result",
					result: res,
					id: ev.id
				});
			}

			catch (e) {
				parentPort.postMessage({
					type: "result",
					error: e,
					id: ev.id
				});
			}
		});
	})();
`;

export class ImportWorker {
	constructor(workerPath, workerOptions={}) {
		this.workerPath=workerPath;
		this.workerOptions={...workerOptions};
		this.workerOptions.eval=true;
		this.callId=1;

		return new Proxy(this,{
			get: (target, prop, receiver)=>{
				if (this.methodNames && this.methodNames.includes(prop)) {
					return async (...params)=>{
						return await this.callMethod(prop,params);
					}
				}

				return this[prop];
			}
		});
	}

	async init() {
		let stub=WORKER_STUB.replace("@path@",JSON.stringify(this.workerPath));
		this.worker=new Worker(stub,this.workerOptions);

		let ev=await awaitEvent(this.worker,"message");
		if (ev.type!="ready")
			throw new Error("Expected ready event");

		this.methodNames=ev.keys;
	}

	async callMethod(method, params) {
		let id=this.callId;
		this.callId++;

		this.worker.postMessage({
			type: "call",
			method: method,
			params: params,
			id: id
		});

		let evPred=ev=>(ev.type=="result" && ev.id==id);
		let ev=await awaitEvent(this.worker,"message",evPred);
		if (ev.error)
			throw ev.error;

		return ev.result;
	}
}

export async function importWorker(path) {
	let w=new ImportWorker(path);

	await w.init();

	return w;
}