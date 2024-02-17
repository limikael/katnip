import {HookRunner} from "katnip";

$$WORKER_DATA$$

let hookRunner=new HookRunner();
for (let mod of workerData.listenerModules)
	hookRunner.addListenerModule(mod);

let envDataMap=new WeakMap();

async function handleFetch(req, env, ctx) {
	if (!envDataMap.get(env)) {
		let envData={...workerData.data};
		envDataMap.set(env,envData);

		await hookRunner.emit("start",{
			importModules: workerData.importModules,
			options: workerData.options,
			data: envData,
			hookRunner: hookRunner,
			env,
		});
	}

	let ev={
		importModules: workerData.importModules,
		options: workerData.options,
		data: envDataMap.get(env),
		hookRunner: hookRunner,
		localFetch: r=>handleFetch(r,env,ctx),
		req,
		env,
		ctx,
	};

	return await hookRunner.emit("fetch",req,ev);
}

export default {
	async fetch(req, env, ctx) {
		return await handleFetch(req,env,ctx);
	}
}