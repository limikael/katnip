import QuickminServer from "quickmin/server";
import {quickminSqliteDriver} from "quickmin/sqlite-driver";
import {nodeStorageDriver} from "quickmin/node-storage";
import {localNodeBundle} from "quickmin/local-node-bundle";

export async function start(ev) {
	let drivers=[
		quickminSqliteDriver,
		nodeStorageDriver,
	];

	if (ev.options.qmLocalBundle) {
		console.log("Loading quickmin bundle locally...");
		drivers.push(localNodeBundle);
	}

	let quickminServer=new QuickminServer(ev.data.quickminConf,drivers);

	ev.data.quickminServer=quickminServer;
	ev.data.quickminApi=quickminServer.api;
}

export async function clientProps(props, ev) {
	props.quickminUser=await ev.data.quickminApi.getUserByRequest(ev.req);
	props.quickminCookieName=ev.data.quickminConf.cookie;
}

fetch.priority=15;
export async function fetch(req, ev) {
	return await ev.data.quickminServer.handleRequest(req);
}
