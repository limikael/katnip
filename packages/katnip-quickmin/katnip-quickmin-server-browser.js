import QuickminServer from "quickmin/server";
import quickminQqlDriver from "quickmin/qql-driver";
import urlJoin from "url-join";

export async function start(ev) {
	console.log("starting quickmin server: "+ev.appPathname);
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

	let quickminServer=new QuickminServer(theConf,[
		quickminQqlDriver,
	]);

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

fetch.priority=15;
export async function fetch(req, ev) {
	if (!ev.data.quickminServer)
		await start(ev);

	return await ev.data.quickminServer.handleRequest(req);
}
