import {urlGetArgs} from "katnip";

fetch.priority=15;
export async function fetch(req, ev) {
	let args=urlGetArgs(req.url);
	if (args.length==1 && args[0]=="rpc" && ev.importModules.rpc) {
		let cls=ev.importModules.rpc.default;
		let body=await req.json();
		let instance;
		try {
			instance=new cls(ev);
		}

		catch (e) {
			console.log("unable to create api instance...");
			console.log(e);
			throw e;
		}

		//console.log("instance created...");

		if (!instance[body.method])
			throw new Error("Not found: "+body.method);
			//throw new HttpError("Not found: "+body.method,{status: 404});

		try {
			let result=await instance[body.method](...body.params);
			if (result===undefined)
				result=null;

			return Response.json({result: result});
		}

		catch (e) {
			console.error(e);
			return new Response(e.message,{
				status: 500
			});
		}
	}
}
