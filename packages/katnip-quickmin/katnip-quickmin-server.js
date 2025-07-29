import QuickminServer from "quickmin/server";

export async function start(startEvent) {
	/*if (startEvent.options.qmLocalBundle) {
		console.log("Loading quickmin bundle locally...");
		drivers.push(localNodeBundle);
	}*/

	//console.log("starting quickmin server");

	let theConf={...startEvent.target.env.quickminConf};
	let fn="default";

	if (startEvent.target.env.DATABASE_STORAGE_URL) {
		let storageMod=startEvent.target.importModules.storageFactoryModule;
		let storageFn=startEvent.target.env.storageFactoryFunction;
		theConf.storageDriver=await storageMod[storageFn]({
			env: startEvent.target.env
		});
	}

	if (startEvent.target.env.DATABASE_URL ||
			startEvent.target.importModules.qqlFactoryModule) {
		let qqlMod=startEvent.target.importModules.qqlFactoryModule;
		let qqlFn=startEvent.target.env.qqlFactoryFunction;
		theConf.qqlDriver=await qqlMod[qqlFn]({
			env: startEvent.target.env
		});
	}

	let env=startEvent.target.env;
	let quickminServer=new QuickminServer(theConf);
	env.quickminServer=quickminServer;
	env.quickminApi=quickminServer.api;
	env.qql=quickminServer.qql;
}

export async function clientProps(ev) {
	let env=ev.target.env;

	ev.props.quickminUser=await env.quickminApi.getUserByRequest(ev.request);
	ev.props.quickminCookieName=env.quickminConf.cookie;
	ev.props.authProviderInfo=env.quickminServer.getAuthProviderInfo(ev.request.url);
}

fetch.priority=15;
export async function fetch(fetchEvent) {
	let quickminServer=fetchEvent.target.env.quickminServer;

	return await quickminServer.handleRequest(fetchEvent.request);
}
