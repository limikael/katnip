import QuickminServer from "quickmin/server";
import quickminQqlDriver from "quickmin/qql-driver";
import urlJoin from "url-join";

export async function start(ev) {
	console.log("starting quickmin server: "+ev.appPathname);
	let theConf={...ev.data.quickminConf};
	theConf.apiPath=urlJoin(ev.appPathname,ev.data.quickminConf.apiPath);

	let quickminServer=new QuickminServer(theConf,[
		quickminQqlDriver,
	]);

	ev.data.quickminServer=quickminServer;
	ev.data.quickminApi=quickminServer.api;
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
