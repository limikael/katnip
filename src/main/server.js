import {quickminCanonicalizeConf, QuickminServer} from "quickmin/server";
import {QqlDriverSqlite} from "quickmin/qql";
import sqlite3 from "sqlite3";
import {nodeStorageDriver} from "quickmin/node-storage";
import path from "node:path";
import {RpcServer} from "fullstack-rpc/server";
import {createQqlDriver, createStorageDriver} from "./create-drivers.js";

export function onStart({imports, use, fs, env, getServiceMeta}) {
	//console.log(env);

	if (env.DB) {
		let conf=env.__QUICKMIN_CONF;

		conf.qqlDriver=createQqlDriver(env.DB,getServiceMeta("DB").type);

		if (env.BUCKET)
			conf.storageDriver=createStorageDriver(env.BUCKET,getServiceMeta("BUCKET").type);

		env.qm=new QuickminServer(conf);
		env.qql=env.qm.qql;
		use(env.qm.handleRequest);
	}

	if (imports.RpcApi) {
		let rpcServer=new RpcServer("rpc");
		use(async ev=>{
			return await rpcServer.handleRequest(ev.request,{
				handlerFactory: ()=>new imports.RpcApi(ev)
			});
		});
	}

	use(async ev=>{
		let clientProps={};

		clientProps.quickminCookieName="qm";
		if (env.qm)
			clientProps.quickminUser=await env.qm.getUserByRequest(ev.request);

		return await imports.isoqRequestHandler(ev.request,{
			localFetch: ev.localFetch,
			props: clientProps
		});
	},{fallback: true});
}

export function onFetch({request, imports}) {
//	return new Response("hello");
}
