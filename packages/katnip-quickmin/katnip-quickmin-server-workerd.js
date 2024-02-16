import QuickminServer from "quickmin/server";
import {drizzleD1Driver} from "quickmin/drizzle-d1";
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
	    drizzleD1Driver,
	    r2StorageDriver,
	]);

	ev.data.quickminServer=quickminServer;
}

fetch.priority=15;
export async function fetch(req, ev) {
	return await ev.data.quickminServer.handleRequest(req);
}
