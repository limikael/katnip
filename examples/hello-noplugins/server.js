export async function fetch(fetchEv) {
	return new Response("hello: "+fetchEv.request.url);
}