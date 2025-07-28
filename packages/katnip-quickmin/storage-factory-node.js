import {NodeStorage} from "quickmin/node-storage";
import path from "node:path";

export default async function createStorageDriver({env}) {
	let storageUrl=new URL(env.DATABASE_STORAGE_URL);

	switch (storageUrl.protocol) {
		case "node+file:":
			let resolvedFn=path.resolve(env.CWD,storageUrl.pathname);
			let storageDriver=new NodeStorage(resolvedFn);
			return storageDriver;
			break;

		default:
			throw new Error("Unknown storage scheme: "+storageUrl.protocol);
	}
}