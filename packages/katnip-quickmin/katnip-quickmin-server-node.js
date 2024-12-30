import QuickminServer from "quickmin/server";
import {dsnDb} from "quickmin/dsn-db";
import {nodeStorageDriver} from "quickmin/node-storage";
import {localNodeBundle} from "quickmin/local-node-bundle";
import urlJoin from "url-join";
export * from "./katnip-quickmin-server-common.js";

export async function start(startEvent) {
	let drivers=[
		dsnDb,
		nodeStorageDriver,
	];

	if (startEvent.options.qmLocalBundle) {
		console.log("Loading quickmin bundle locally...");
		drivers.push(localNodeBundle);
	}

	console.log("starting quickmin server, appPathname="+startEvent.appPathname);

	let theConf={...startEvent.appData.quickminConf};
	if (startEvent.appPathname)
		theConf.apiPath=urlJoin(startEvent.appPathname,startEvent.appData.quickminConf.apiPath);

	let quickminServer=new QuickminServer(theConf,drivers);

	startEvent.appData.quickminServer=quickminServer;
	startEvent.appData.quickminApi=quickminServer.api;
	startEvent.appData.qql=startEvent.appData.quickminServer.qql;
}
