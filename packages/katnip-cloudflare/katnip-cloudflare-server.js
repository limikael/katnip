fetch.priority=5;
export async function fetch(fetchEvent) {
	let ignore=["localhost","127.0.0.1"];
	let u=new URL(fetchEvent.request.url);

	//console.log("serving: "+fetchEvent.request.url+" hostname: "+u.hostname);

	if (u.protocol=="http:" &&
			!ignore.includes(u.hostname)) {
		u.protocol="https:";
		let headers=new Headers();
		headers.set("location",u);
		return new Response("Moved",{
			status: 301,
			headers: headers
		});
	}
}