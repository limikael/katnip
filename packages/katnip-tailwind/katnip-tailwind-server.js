import urlJoin from "url-join";

fetch.priority=15;
export async function fetch(req, ev) {
	if (req.method.toUpperCase()!="GET")
		return;

	let appPathname="/";
	if (ev.appPathname)
		appPathname=ev.appPathname;

	let indexCssPath=urlJoin(appPathname,"index.css");
	let u=new URL(req.url);

	//console.log("tw ipath:   "+indexCssPath);
	//console.log("u.pathname: "+u.pathname)
	//console.log("tw index.css: "+ev.data.indexCss);

	if (u.pathname==indexCssPath && ev.data.indexCss)
		return new Response(ev.data.indexCss,{
			headers: {
				"content-type": "text/css"
			}
		});
}
