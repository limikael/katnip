import {urlGetArgs} from "katnip";
import {RpcServer} from "fullstack-rpc/server";
import urlJoin from "url-join";

export async function start(startEvent) {
	let server=startEvent.target;
	//console.log("************* start rpc server: ",server.importModules.rpc);
	if (!server.importModules.rpc)
		return;

	let rpcPath="/rpc";//urlJoin(startEvent.appPathname,"rpc");
	//console.log("***** rpcpath: "+rpcPath);

	server.env.rpcServer=new RpcServer(rpcPath);

	//console.log("***** rpcserver: "+server.env.rpcServer);
}

fetch.priority=15;
export async function fetch(fetchEvent) {
	let server=fetchEvent.target;
	if (!server.env.rpcServer)
		return;

	//console.log("hadling fetch in rpc...");
	//console.log(ev.importModules.rpc.default);

	let cls=server.importModules.rpc.default;
	return await server.env.rpcServer.handleRequest(fetchEvent.request,{
		handlerFactory: ()=>new cls(fetchEvent)
	});
}
