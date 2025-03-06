export default `
import {HookRunner, HookEvent} from "katnip";

$$WORKER_DATA$$

let hookRunner=new HookRunner();
for (let mod of workerData.listenerModules)
	hookRunner.addListenerModule(mod);

async function createAppData(env) {
	let envAppData={...workerData.appData};

	console.log("creating env specific app data!!");

	await hookRunner.dispatch(new HookEvent("start",{
		appPathname: "/",
		importModules: workerData.importModules,
		options: workerData.options,
		appData: envAppData,
		hookRunner: hookRunner,
		env,
	}));

	console.log("app data created:");
	//console.log(envAppData);

	return envAppData;
}

let envAppDataMap=new WeakMap();

function getAppData(env) {
	if (!envAppDataMap.get(env))
		envAppDataMap.set(createAppData(env));

	return envAppDataMap.get(env);
}

export default {
	async fetch(req, env, ctx) {
		console.log(env);

		return await hookRunner.dispatch(new HookEvent("fetch",{
			appPathname: "/",
			importModules: workerData.importModules,
			options: workerData.options,
			appData: await getAppData(env),
			hookRunner: hookRunner,
			localFetch: r=>handleFetch(r,env,ctx),
			request: req,
			env,
			ctx,
		}));

		return await handleFetch(req,env,ctx);
	},

	async scheduled(ev, env, ctx) {
		console.log("schedule...");
	}
}
`;
