import {parse as parseYaml} from "yaml";
import path from "path-browserify";
import {QuickminServer, quickminCanonicalizeConf} from "quickmin/server";
import fsStorage from "quickmin/fs-storage";
import mockStorage from "quickmin/mock-storage";
import * as TOML from "@ltd/j-toml";
import {QqlDriverSqlJs, QqlDriverSqlExec} from "qql";
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
			conf.qqlDriver=new QqlDriverSqlJs(ev.sql);
			conf.fs=ev.fs;
			conf.upload=path.join(ev.cwd,"upload");

			ev.data.quickminConf=conf;

			//console.log("starting with fs storage!!!!");

			let server=new QuickminServer({...conf},[
				fsStorage
			]);
			await server.sync({});
			break;

		case "workerd":
			ev.data.quickminConf=conf;

			//console.log("Migrating remote DB...")
			let migrationConf={...conf};
			migrationConf.qqlDriver=new QqlDriverSqlExec(q=>ev.sqlExec(q));

			let migrationServer=new QuickminServer(migrationConf,[mockStorage]);
			await migrationServer.sync({});
			break;

		default:
			throw new Error("Unknown platform: "+ev.platform);
			break;
	}
}

editorData.priority=5;
export async function editorData(editorData, ev) {
	let conf=quickminCanonicalizeConf();
	let confFn=path.join(ev.cwd,"quickmin.yaml");
	if (await exists(confFn,{fs:ev.fs})) {
		let confText=await ev.fs.promises.readFile(confFn,"utf8");
		conf=quickminCanonicalizeConf(confText);
	}

	await ev.hookRunner.emit("quickminConf",conf,ev);

	editorData.quickminConf=conf;
}