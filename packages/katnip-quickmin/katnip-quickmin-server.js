import QuickminServer from "quickmin/server";

export async function start(startEvent) {
	/*if (startEvent.options.qmLocalBundle) {
		console.log("Loading quickmin bundle locally...");
		drivers.push(localNodeBundle);
	}*/

	//console.log("starting quickmin server");

	let theConf={...startEvent.target.env.quickminConf};

	let mod=startEvent.target.importModules.qqlFactoryModule;
	let fn="default";
	theConf.qqlDriver=await mod[fn]({
		dsn: startEvent.target.config.dsn,
		target: startEvent.target
	});

	let env=startEvent.target.env;
	let quickminServer=new QuickminServer(theConf);
	env.quickminServer=quickminServer;
	env.quickminApi=quickminServer.api;
	env.qql=quickminServer.qql;
}

export async function clientProps(ev) {
	ev.props.quickminUser=await ev.target.env.quickminApi.getUserByRequest(ev.request);
	ev.props.quickminCookieName=ev.target.env.quickminConf.cookie;
}

fetch.priority=15;
export async function fetch(fetchEvent) {
	let quickminServer=fetchEvent.target.env.quickminServer;

	return await quickminServer.handleRequest(fetchEvent.request);
}
