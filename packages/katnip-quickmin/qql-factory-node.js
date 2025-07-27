import {createClient} from "@libsql/client";
import {QqlDriverLibSql} from "quickmin/qql";
import path from "node:path";

export default async function createQqlDriver({target, dsn}) {
	let dsnUrl=new URL(dsn);

	switch (dsnUrl.protocol) {
		case "libsql+file:":
			let resolvedFn=path.resolve(target.cwd,dsnUrl.pathname);
			//console.log(resolvedFn);
			let client=createClient({url: "file:"+resolvedFn});
			return new QqlDriverLibSql({client: client});
			break;

		default:
			throw new Error("Unknown database scheme: "+dsnUrl.protocol);
	}
}