import {createClient} from "@libsql/client";
import {QqlDriverLibSql} from "quickmin/qql";
import {NodeStorage} from "quickmin/node-storage";
import path from "node:path";

export async function createQqlDriver({env}) {
	let dsnUrl=new URL(env.DATABASE_URL);

	switch (dsnUrl.protocol) {
		case "libsql+file:":
			let resolvedFn=path.resolve(env.CWD,dsnUrl.pathname);
			let client=createClient({url: "file:"+resolvedFn});
			return new QqlDriverLibSql({client: client});
			break;

		default:
			throw new Error("Unknown database scheme: "+dsnUrl.protocol);
	}
}

export async function createStorageDriver({env}) {
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