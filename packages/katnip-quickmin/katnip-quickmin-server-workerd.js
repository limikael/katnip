import QuickminServer from "quickmin/server";
import {quickminD1Driver} from "quickmin/d1-driver";
import {r2StorageDriver} from "quickmin/r2-storage";

export async function start(ev) {
	let quickminConf=ev.data.quickminConf;

	if (quickminConf.d1Binding && quickminConf.d1Binding!="DB")
		throw new Error("D1 binding most be DB");

	if (quickminConf.r2Bucket && quickminConf.r2Bucket!="BUCKET")
		throw new Error("R2 binding most be BUCKET");

	quickminConf.d1Binding="DB";
	quickminConf.r2Bucket="BUCKET";
	quickminConf.env=ev.env;

	let quickminServer=new QuickminServer(quickminConf,[
	    quickminD1Driver,
	    r2StorageDriver,
	]);

	ev.data.quickminServer=quickminServer;
	ev.data.quickminApi=quickminServer.api;
}

export async function clientProps(props, ev) {
	props.quickminUser=await ev.data.quickminApi.getUserByRequest(ev.req);
}

fetch.priority=15;
export async function fetch(req, ev) {
	return await ev.data.quickminServer.handleRequest(req);
}
