import {urlGetArgs} from "katnip";
import {RpcServer} from "fullstack-rpc/server";
import urlJoin from "url-join";

export async function start(ev) {
	//console.log("************* start rpc server...");

	if (!ev.importModules.rpc)
		return;

	let rpcPath=urlJoin(ev.appPathname,"rpc");
	//console.log("***** rpcpath: "+rpcPath);

	ev.data.rpcServer=new RpcServer(rpcPath);
}

fetch.priority=15;
export async function fetch(req, ev) {
	if (!ev.data.rpcServer)
		return;

	//console.log("hadling fetch in rpc...");
	//console.log(ev.importModules.rpc.default);

	let cls=ev.importModules.rpc.default;
	return ev.data.rpcServer.handleRequest(req,{
		handlerFactory: ()=>new cls(ev)
	});
}
