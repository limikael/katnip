import {NodeStorage} from "quickmin/node-storage";
import path from "node:path";

export default async function createStorageDriver({target, storage}) {
	let storageUrl=new URL(storage);

	switch (storageUrl.protocol) {
		case "node+file:":
			let resolvedFn=path.resolve(target.cwd,storageUrl.pathname);
			let storageDriver=new NodeStorage(resolvedFn);
			return storageDriver;
			break;

		default:
			throw new Error("Unknown storage scheme: "+storageUrl.protocol);
	}
}