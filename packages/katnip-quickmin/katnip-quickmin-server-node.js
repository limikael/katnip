import QuickminServer from "quickmin/server";
import {quickminSqliteDriver} from "quickmin/sqlite-driver";
import {nodeStorageDriver} from "quickmin/node-storage";
//import {localNodeBundle} from "quickmin/local-node-bundle";

export async function start(ev) {
	//console.log("starting qm server, drizzle ",drizzleSqliteDriver);
	let quickminServer=new QuickminServer(ev.data.quickminConf,[
		quickminSqliteDriver,
		nodeStorageDriver
	]);

	ev.data.quickminServer=quickminServer;
	ev.data.quickminApi=quickminServer.api;
}

fetch.priority=15;
export async function fetch(req, ev) {
	return await ev.data.quickminServer.handleRequest(req);
}
