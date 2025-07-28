import {createClient} from "@libsql/client";
import {QqlDriverLibSql} from "quickmin/qql";
import path from "node:path";

export default async function createQqlDriver({env}) {
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