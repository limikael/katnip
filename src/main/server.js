import {quickminCanonicalizeConf, QuickminServer} from "quickmin/server";
import {RpcServer} from "fullstack-rpc/server";
import {createQqlDriver, createStorageDriver} from "./create-drivers.js";

export function onStart({imports, use, fs, env, getServiceMeta, platform}) {
	//console.log(env);

	/*use(async ev=>{
		await new Promise(r=>setTimeout(r,250));
	});*/

	if (env.DB) {
		let conf=env.__QUICKMIN_CONF;

		conf.qqlDriver=createQqlDriver(env.DB,getServiceMeta("DB").type);

		if (env.BUCKET)
			conf.storageDriver=createStorageDriver(env.BUCKET,getServiceMeta("BUCKET").type);

		let drivers=[];

		if (env.QUICKMIN_LOCAL_BUNDLE && platform=="node")
			drivers.push(imports.localNodeBundle);

		env.qm=new QuickminServer(conf,drivers);
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

	if (!env.__CLIENT_PROPS)
		env.__CLIENT_PROPS={};

	use(async ev=>{
		let clientProps={...env.__CLIENT_PROPS};

		if (env.DB) {
			clientProps.quickminCookieName=env.__QUICKMIN_CONF.cookie;
			clientProps.authProviderInfo=env.qm.getAuthProviderInfo(ev.request.url);
			clientProps.quickminUser=await env.qm.getUserByRequest(ev.request);
		}

		return await imports.isoqRequestHandler(ev.request,{
			localFetch: ev.localFetch,
			props: clientProps
		});
	},{fallback: true});
}

export function onFetch({request, imports}) {
//	return new Response("hello");
}
