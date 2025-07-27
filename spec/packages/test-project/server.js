onFetch.event="fetch";
export function onFetch(ev) {
	let url=new URL(ev.request.url);
	if (url.pathname=="/hello")
		return new Response("hello world");
}