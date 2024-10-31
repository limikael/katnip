import QuickminServer from "quickmin/server";
import quickminQqlDriver from "quickmin/qql-driver";
import fsStorage from "quickmin/fs-storage";
//import {localFsBundle} from "quickmin/local-fs-bundle";
import urlJoin from "url-join";

export async function start(ev) {
	//console.log("starting quickmin server: "+ev.appPathname);
	let theConf={...ev.data.quickminConf};

	for (let collectionId in theConf.collections) {
		let collection=theConf.collections[collectionId];
		if (collection.actions) {
			for (let action of collection.actions) {
				action.url=urlJoin(ev.appPathname,action.url);
			}
		}
	}

	theConf.apiPath=urlJoin(ev.appPathname,ev.data.quickminConf.apiPath);

	let drivers=[
		quickminQqlDriver,
		fsStorage
	];

	/*if (true / *ev.options.qmLocalBundle* /) {
		console.log("Loading quickmin bundle locally through browser...");
		drivers.push(localFsBundle);
	}*/

	//theConf.bundleUrl="http://localhost:3000/admin/_dist/quickmin-bundle.js";

	let quickminServer=new QuickminServer(theConf,drivers);

	//console.log("quickmin storage used: "+quickminServer.isStorageUsed());

	ev.data.quickminServer=quickminServer;
	ev.data.quickminApi=quickminServer.api;
	ev.data.qql=async (query)=>{
		return await ev.data.quickminServer.qql.query(query);
	}
}

export async function clientProps(props, ev) {
	props.quickminUser=await ev.data.quickminApi.getUserByRequest(ev.req);
	props.quickminCookieName=ev.data.quickminConf.cookie;
}

export async function cron(ev) {
	await ev.data.quickminServer.garbageCollect();
}

fetch.priority=15;
export async function fetch(req, ev) {
	if (!ev.data.quickminServer)
		await start(ev);

	return await ev.data.quickminServer.handleRequest(req);
}
