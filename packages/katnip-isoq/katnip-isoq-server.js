import {HookEvent} from "katnip";

fetch.priority=20;
export async function fetch(fetchEvent) {
	if (fetchEvent.request.method.toUpperCase()!="GET")
		return;

	let requestHandler=fetchEvent.importModules.isoqRequestHandler.default;

	let props={};
	await fetchEvent.target.dispatch(new HookEvent("clientProps",{
		props,
		...fetchEvent
	}));

	try {
		let res=await requestHandler(fetchEvent.request,{
			props: props,
			localFetch: fetchEvent.localFetch,
			appPathname: fetchEvent.appPathname
		});

		return res;
	}

	catch (e) {
		console.log("Isoq err: ",e);
		throw e;
	}
}

