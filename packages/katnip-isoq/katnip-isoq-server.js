fetch.priority=20;
export async function fetch(req, ev) {
	if (req.method.toUpperCase()!="GET")
		return;

	let requestHandler=ev.importModules.isoqRequestHandler.default;

	let props={};
	await ev.hookRunner.emit("clientProps",props,ev);

	return await requestHandler(req,{
		props: props,
		localFetch: ev.localFetch,
		appPathname: ev.appPathname
	});
}

