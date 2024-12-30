import {urlGetArgs} from "katnip";
import {RpcServer} from "fullstack-rpc/server";
import urlJoin from "url-join";

export async function start(startEvent) {
	//console.log("************* start rpc server...");

	if (!startEvent.importModules.rpc)
		return;

	let rpcPath=urlJoin(startEvent.appPathname,"rpc");
	//console.log("***** rpcpath: "+rpcPath);

	startEvent.appData.rpcServer=new RpcServer(rpcPath);
}

fetch.priority=15;
export async function fetch(fetchEvent) {
	if (!fetchEvent.appData.rpcServer)
		return;

	//console.log("hadling fetch in rpc...");
	//console.log(ev.importModules.rpc.default);

	let cls=fetchEvent.importModules.rpc.default;
	return await fetchEvent.appData.rpcServer.handleRequest(fetchEvent.request,{
		handlerFactory: ()=>new cls(fetchEvent)
	});
}
