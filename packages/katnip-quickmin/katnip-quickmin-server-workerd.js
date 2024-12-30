import QuickminServer from "quickmin/server";
import {d1DbDriver} from "quickmin/d1-db";
import {r2StorageDriver} from "quickmin/r2-storage";
export * from "./katnip-quickmin-server-common.js";

export async function start(startEvent) {
	let quickminConf=startEvent.appData.quickminConf;

	if (quickminConf.d1Binding && quickminConf.d1Binding!="DB")
		throw new Error("D1 binding most be DB");

	if (quickminConf.r2Bucket && quickminConf.r2Bucket!="BUCKET")
		throw new Error("R2 binding most be BUCKET");

	quickminConf.d1Binding="DB";
	quickminConf.r2Bucket="BUCKET";
	quickminConf.env=startEvent.env;

	let quickminServer=new QuickminServer(quickminConf,[
	    d1DbDriver,
	    r2StorageDriver,
	]);

	startEvent.appData.quickminServer=quickminServer;
	startEvent.appData.quickminApi=quickminServer.api;
	startEvent.appData.qql=async (query)=>{
		return await startEvent.appData.quickminServer.qql.query(query);
	}
}
