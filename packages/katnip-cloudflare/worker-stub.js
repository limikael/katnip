export default `
import {HookRunner, HookEvent} from "katnip";

$$WORKER_DATA$$

let hookRunner=new HookRunner();
for (let mod of workerData.listenerModules)
	hookRunner.addListenerModule(mod);

let envDataMap=new WeakMap();

async function handleFetch(req, env, ctx) {
	if (!envDataMap.get(env)) {
		let envData={...workerData.appData};
		envDataMap.set(env,envData);

		await hookRunner.dispatch(new HookEvent("start",{
			appPathname: "/",
			importModules: workerData.importModules,
			options: workerData.options,
			appData: envData,
			hookRunner: hookRunner,
			env,
		}));
	}

	return await hookRunner.dispatch(new HookEvent("fetch",{
		appPathname: "/",
		importModules: workerData.importModules,
		options: workerData.options,
		appData: envDataMap.get(env),
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