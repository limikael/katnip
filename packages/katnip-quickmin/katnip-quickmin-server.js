import QuickminServer from "quickmin/server";

export async function start(startEvent) {
	/*if (startEvent.options.qmLocalBundle) {
		console.log("Loading quickmin bundle locally...");
		drivers.push(localNodeBundle);
	}*/

	//console.log("starting quickmin server");

	let theConf={...startEvent.target.env.quickminConf};
	let fn="default";

	if (startEvent.target.config.databaseStorage) {
		let storageMod=startEvent.target.importModules.storageFactoryModule;
		theConf.storageDriver=await storageMod[fn]({
			storage: startEvent.target.config.databaseStorage,
			target: startEvent.target
		});
	}

	if (startEvent.target.config.databaseServiceName) {
		let qqlMod=startEvent.target.importModules.qqlFactoryModule;
		theConf.qqlDriver=await qqlMod[fn]({
			dsn: startEvent.target.config.databaseServiceName,
			target: startEvent.target
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
