export async function clientProps(ev) {
	ev.props.quickminUser=await ev.appData.quickminApi.getUserByRequest(ev.request);
	ev.props.quickminCookieName=ev.appData.quickminConf.cookie;
}

fetch.priority=15;
export async function fetch(fetchEvent) {
	let quickminServer=fetchEvent.appData.quickminServer;

	return await quickminServer.handleRequest(fetchEvent.request);
}
