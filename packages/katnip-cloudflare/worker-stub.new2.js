export default `
import {HookRunner, HookEvent} from "katnip";

$$WORKER_DATA$$

let hookRunner=new HookRunner();
for (let mod of workerData.listenerModules)
	hookRunner.addListenerModule(mod);

let envAppDataMap=new WeakMap();

async function createEnvAppData(env) {
	console.log("creating env specific app data");

	let envData={...workerData.appData};
		//envAppDataMap.set(env,envData);

	await hookRunner.dispatch(new HookEvent("start",{
		appPathname: "/",
		importModules: workerData.importModules,
		options: workerData.options,
		appData: envData,
		hookRunner: hookRunner,
		env,
	}));
}

async function handleFetch(req, env, ctx) {
	if (!envAppDataMap.get(env)) {
		let envAppData=await createEnvAppData(env);

		envAppDataMap.set(env,envAppData);
	}

	return await hookRunner.dispatch(new HookEvent("fetch",{
		appPathname: "/",
		importModules: workerData.importModules,
		options: workerData.options,
		appData: envAppDataMap.get(env),
		hookRunner: hookRunner,
		localFetch: r=>handleFetch(r,env,ctx),
		request: req,
		env,
		ctx,
	}));
}

export default {
	async fetch(req, env, ctx) {
		return await handleFetch(req,env,ctx);
	}
}
`;