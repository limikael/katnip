import QuickminServer from "quickmin/server";
import {AsyncEvent} from "katnip";

export async function start(startEvent) {
	//console.log("**** quickmin start",startEvent.target.env.quickminConf);

	/*if (startEvent.options.qmLocalBundle) {
		console.log("Loading quickmin bundle locally...");
		drivers.push(localNodeBundle);
	}*/

	if (!startEvent.target.env.quickminConf)
		return;

	let theConf={...startEvent.target.env.quickminConf};
	theConf.qqlDriver=await startEvent.target.dispatchEvent(new AsyncEvent("createDatabaseQqlDriver"));
	theConf.storageDriver=await startEvent.target.dispatchEvent(new AsyncEvent("createDatabaseStorageDriver"));

	//await new Promise(r=>setTimeout(r,1000));

	let env=startEvent.target.env;
	let quickminServer=new QuickminServer(theConf);
	env.quickminServer=quickminServer;
	env.quickminApi=quickminServer.api;
	env.qql=quickminServer.qql;
}

export async function clientProps(ev) {
	if (!ev.target.env.quickminConf)
		return;

	let env=ev.target.env;

	ev.props.quickminUser=await env.quickminApi.getUserByRequest(ev.request);
	ev.props.quickminCookieName=env.quickminConf.cookie;
	ev.props.authProviderInfo=env.quickminServer.getAuthProviderInfo(ev.request.url);
}

fetch.priority=15;
export async function fetch(fetchEvent) {
	if (!fetchEvent.target.env.quickminConf)
		return;

	let quickminServer=fetchEvent.target.env.quickminServer;

	return await quickminServer.handleRequest(fetchEvent.request);
}
