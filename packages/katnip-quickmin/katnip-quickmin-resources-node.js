import {createClient} from "@libsql/client";
import {QqlDriverLibSql} from "quickmin/qql";
import {NodeStorage} from "quickmin/node-storage";
import path from "node:path";

createDatabaseQqlDriver.priority=15;
export async function createDatabaseQqlDriver(ev) {
	if (ev.target.mode=="test") {
		return new QqlDriverLibSql({client: createClient({url: ":memory:"})});
	}

	let env=ev.env;
	if (!env.DATABASE_URL)
		return;

	let dsnUrl=new URL(env.DATABASE_URL);

	switch (dsnUrl.protocol) {
		case "libsql+file:": {
				let resolvedFn=path.resolve(env.CWD,dsnUrl.pathname);
				let client=createClient({url: "file:"+resolvedFn});
				return new QqlDriverLibSql({client: client});
			}
			break;

		case "libsql:": {
				let client=createClient({
					url: env.DATABASE_URL,
					authToken: env.DATABASE_AUTH_TOKEN
				});
				return new QqlDriverLibSql({client: client});
			}
			break;

		/*default:
			throw new Error("Unknown database scheme: "+dsnUrl.protocol);*/
	}
}

createDatabaseStorageDriver.priority=15;
export async function createDatabaseStorageDriver({env}) {
	if (!env.DATABASE_STORAGE_URL)
		return;

	let storageUrl=new URL(env.DATABASE_STORAGE_URL);

	switch (storageUrl.protocol) {
		case "node+file:":
			let resolvedFn=path.resolve(env.CWD,storageUrl.pathname);
			let storageDriver=new NodeStorage(resolvedFn);
			return storageDriver;
			break;
	}
}