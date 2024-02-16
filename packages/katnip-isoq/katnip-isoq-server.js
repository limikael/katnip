fetch.priority=20;
export async function fetch(req, ev) {
	let requestHandler=ev.importModules.isoqRequestHandler.default;

	return await requestHandler(req,{
		localFetch: ev.localFetch
	});
}

