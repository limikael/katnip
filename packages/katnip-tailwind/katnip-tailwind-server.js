import urlJoin from "url-join";

fetch.priority=15;
export async function fetch(fetchEvent) {
	if (fetchEvent.request.method.toUpperCase()!="GET")
		return;

	let appPathname="/";
	if (fetchEvent.appPathname)
		appPathname=fetchEvent.appPathname;

	let indexCssPath=urlJoin(appPathname,"index.css");
	let u=new URL(fetchEvent.request.url);

	//console.log("tw ipath:   "+indexCssPath);
	//console.log("u.pathname: "+u.pathname)
	//console.log("tw index.css: "+ev.data.indexCss);

	if (u.pathname==indexCssPath && fetchEvent.appData.indexCss)
		return new Response(fetchEvent.appData.indexCss,{
			headers: {
				"content-type": "text/css"
			}
		});
}
