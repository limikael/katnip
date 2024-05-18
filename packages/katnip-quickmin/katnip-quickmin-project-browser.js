import {parse as parseYaml} from "yaml";
import path from "path-browserify";
import QuickminServer from "quickmin/server";
import quickminQqlDriver from "quickmin/qql-driver";
import * as TOML from "@ltd/j-toml";
import {qqlDriverSqlJs} from "qql";

build.priority=15;
export async function build(ev) {
	console.log("quickmin browser build...");
	if (!ev.sql)
		throw new Error("no db availble!!!");

	let confFn=path.join(ev.cwd,"quickmin.yaml");
	let conf=parseYaml(await ev.fs.promises.readFile(confFn,"utf8"));

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

	conf.qqlDriver=qqlDriverSqlJs(ev.sql);

	ev.data.quickminConf=conf;

	let server=new QuickminServer({...conf},[quickminQqlDriver]);
	await server.sync({});
}