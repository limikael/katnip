import {AsyncEvent} from "../../src/exports/exports-default.js";

fetch.priority=20;
export async function fetch(fetchEvent) {
	if (fetchEvent.request.method.toUpperCase()!="GET")
		return;

	let server=fetchEvent.target;
	let requestHandler=server.importModules.isoqRequestHandler.default;

	let props={};
	await server.dispatchEvent(new AsyncEvent("clientProps",{
		props,
		env: fetchEvent.target.env,
		request: fetchEvent.request
	}));

	try {
		let res=await requestHandler(fetchEvent.request,{
			props: props,
			localFetch: fetchEvent.localFetch,
		});

		return res;
	}

	catch (e) {
		console.log("Isoq err: ",e);
		throw e;
	}
}
