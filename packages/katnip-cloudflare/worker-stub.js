export default `
import {HookRunner, HookEvent} from "katnip";

$$WORKER_DATA$$

let hookRunner=new HookRunner();
for (let mod of workerData.listenerModules)
	hookRunner.addListenerModule(mod);

async function createEnvAppData(env) {
	console.log("Starting env...");

	let envAppData={...workerData.appData};

	await hookRunner.dispatch(new HookEvent("start",{
		appPathname: "/",
		importModules: workerData.importModules,
		options: workerData.options,
		appData: envAppData,
		hookRunner: hookRunner,
		env,
	}));

	return envAppData;
}

let envAppDataMap=new WeakMap();

async function handleFetch(req, env, ctx) {
	if (!envAppDataMap.get(env))
		envAppDataMap.set(env,createEnvAppData(env));

	return await hookRunner.dispatch(new HookEvent("fetch",{
		appPathname: "/",
		importModules: workerData.importModules,
		options: workerData.options,
		appData: await envAppDataMap.get(env),
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
	},

	async scheduled(ev, env, ctx) {
		console.log("scheduled in worker...");

		if (!envAppDataMap.get(env))
			envAppDataMap.set(env,createEnvAppData(env));

		return await hookRunner.dispatch(new HookEvent("scheduled",{
			appPathname: "/",
			importModules: workerData.importModules,
			options: workerData.options,
			appData: await envAppDataMap.get(env),
			hookRunner: hookRunner,
			localFetch: r=>handleFetch(r,env,ctx),
			cron: ev.cron,
			scheduledTime: ev.scheduledTime,
			env,
			ctx,
		}));
	}
}
`;