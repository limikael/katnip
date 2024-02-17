import {urlGetArgs} from "katnip";
import {RpcServer} from "fullstack-rpc/server";

export async function start(ev) {
	if (!ev.importModules.rpc)
		return;

	ev.data.rpcServer=new RpcServer("rpc");
}

fetch.priority=15;
export async function fetch(req, ev) {
	if (!ev.data.rpcServer)
		return;

	let cls=ev.importModules.rpc.default;
	return ev.data.rpcServer.handleRequest(req,{
		handlerFactory: ()=>new cls(ev)
	});
}
