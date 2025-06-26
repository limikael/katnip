export function onStart({imports, use}) {
	use(({request})=>imports.isoqRequestHandler(request));
}

export function onFetch({request, imports}) {
	return new Response("hello");
}