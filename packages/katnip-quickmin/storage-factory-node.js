import {NodeStorage} from "quickmin/node-storage";
import path from "node:path";

export default async function createStorageDriver({target, storage}) {
	console.log(target);

	let storageUrl=new URL(storage);

	console.log(storageUrl.protocol);

	switch (storageUrl.protocol) {
		case "node+file:":
			console.log("storage pathname: "+storageUrl.pathname);

			let resolvedFn=path.resolve(target.cwd,storageUrl.pathname);
			let storageDriver=new NodeStorage(resolvedFn);
			return storageDriver;
			break;

		default:
			throw new Error("Unknown storage scheme: "+storageUrl.protocol);
	}
}