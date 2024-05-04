import path from "path-browserify";

export function importUrlGetFilename(importUrl) {
	let u=new URL(importUrl);
	if (u.searchParams.get("entrypoint"))
		return u.searchParams.get("entrypoint");

	let hashParams=new URLSearchParams(u.hash.replace("#",""))
	if (hashParams.get("entrypoint"))
		return hashParams.get("entrypoint");

	return u.pathname;
}

export function importUrlGetDirname(importUrl) {
	return path.dirname(importUrlGetFilename(importUrl));
}