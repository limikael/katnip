import {parse as parseYaml} from "yaml";
import path from "path-browserify";
import QuickminServer from "quickmin/server";
import quickminQqlDriver from "quickmin/qql-driver";
import * as TOML from "@ltd/j-toml";
import {qqlDriverSqlJs} from "qql";
import {exists} from "katnip";

build.priority=15;
export async function build(ev) {
	//console.log("quickmin browser build...");
	if (!ev.sql)
		throw new Error("no db availble!!!");

	let confFn=path.join(ev.cwd,"quickmin.yaml");
	if (!await exists(confFn,{fs:ev.fs}))
		throw new Error("No quickmin.yaml file found! If you don't want to use a database, disable the katnip-quickmin plugin");

	let conf=parseYaml(await ev.fs.promises.readFile(confFn,"utf8"));
	if (!conf)
		conf={};

	if (!conf.collections)
		conf.collections={};

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

			ev.data.quickminConf=conf;

			let server=new QuickminServer({...conf},[quickminQqlDriver]);
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