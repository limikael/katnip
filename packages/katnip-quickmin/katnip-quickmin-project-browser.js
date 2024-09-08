import {parse as parseYaml} from "yaml";
import path from "path-browserify";
import {QuickminServer, quickminCanonicalizeConf} from "quickmin/server";
import quickminQqlDriver from "quickmin/qql-driver";
import fsStorage from "quickmin/fs-storage";
import * as TOML from "@ltd/j-toml";
import {qqlDriverSqlJs} from "qql";
import {exists} from "katnip";

build.priority=15;
export async function build(ev) {
	//console.log("quickmin browser build...");
	if (!ev.sql)
		throw new Error("no db availble!!!");

	let conf=quickminCanonicalizeConf();
	let confFn=path.join(ev.cwd,"quickmin.yaml");
	if (await exists(confFn,{fs:ev.fs})) {
		let confText=await ev.fs.promises.readFile(confFn,"utf8");
		conf=quickminCanonicalizeConf(confText);
	}

	await ev.hookRunner.emit("quickminConf",conf,ev);

	if (!conf.adminUser && !conf.adminPass) {
		conf.adminUser="admin";
		conf.adminPass="admin";
	}

	if (!conf.jwtSecret)
		conf.jwtSecret="helloworld";

	if (!conf.apiPath)
		conf.apiPath="admin";

	if (!conf.cookie)
		conf.cookie="qmtoken";

	if (conf.apiPath!="admin")
		throw new Error("Only api path 'admin' supported for now...");

	switch (ev.platform) {
		case "browser":
			conf.qqlDriver=qqlDriverSqlJs(ev.sql);
			conf.fs=ev.fs;
			conf.upload=path.join(ev.cwd,"upload");

			ev.data.quickminConf=conf;

			//console.log("starting with fs storage!!!!");

			let server=new QuickminServer({...conf},[
				quickminQqlDriver,
				fsStorage
			]);
			await server.sync({});
			break;

		case "workerd":
			ev.data.quickminConf=conf;

			//console.log("Migrating remote DB...")
			let migrationConf={...conf};
			migrationConf.qqlDriver=async (queries, returnType)=>{
				if (returnType!="rows")
					throw new Error("Only rows supported");

				//console.log(queries);

				return await ev.sqlExec(queries.join(";"));
			}
			let migrationServer=new QuickminServer(migrationConf,[quickminQqlDriver]);
			await migrationServer.sync({});
			break;

		default:
			throw new Error("Unknown platform: "+ev.platform);
			break;
	}
}