import {katnipServe, katnipInit} from "../../src/main/katnip-commands.js";
import path from "node:path";
import {fileURLToPath} from 'node:url';
import fs, {promises as fsp} from "fs";
import {JSDOM} from "jsdom";
import {quickminCanonicalizeConf, QuickminServer} from "quickmin/server";
import {QqlDriverBetterSqlite3} from "quickmin/qql";
//import sqlite3 from "sqlite3";
import Database from "better-sqlite3"
import nodeStorageDriver from "quickmin/node-storage";
import {createRpcProxy} from "fullstack-rpc/client";
import {cloudflareGetBinding} from "../../src/utils/cloudflare-util.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("katnip-commands",()=>{
	it("can initialize a new project",async ()=>{
		let projectDir=path.join(__dirname,"../data/tmp/project1");
		await fsp.rm(projectDir,{recursive: true, force: true});
		await katnipInit({cwd: projectDir, quiet: true});

		let projectDir2=path.join(__dirname,"../data/tmp/project2");
		await fsp.rm(projectDir2,{recursive: true, force: true});
		await katnipInit({cwd: projectDir2, quiet: true, platform: "cloudflare"});
	});

	it("can initialize cloudflare",async ()=>{
		let projectDir=path.join(__dirname,"../data/tmp/cfproject");
		await fsp.rm(projectDir,{recursive: true, force: true});
		await katnipInit({cwd: projectDir, quiet: true, platform: "cloudflare"});

		let wranglerJson=JSON.parse(fs.readFileSync(path.join(projectDir,"wrangler.json")));
		expect(cloudflareGetBinding(wranglerJson,"DB")).toEqual({
			"binding": "DB",
			"database_name": "cfproject",
			"database_id": "undefined",
			"preview_database_id": "cfproject"
		})
	});

	it("can serve",async ()=>{
		await fsp.rm(path.join(__dirname,"testproject/quickmin.db"),{force: true});
		await fsp.rm(path.join(__dirname,"testproject/public/index.css"),{force: true});

		let server=await katnipServe({
			cwd: path.join(__dirname,"testproject"),
			quiet: true,
		});

		let conf=quickminCanonicalizeConf(fs.readFileSync(path.join(__dirname,"testproject/quickmin.yaml"),"utf8"));
		conf.qqlDriver=new QqlDriverBetterSqlite3(new Database(path.join(__dirname,"testproject/quickmin.db")));
		let qm=new QuickminServer(conf,[nodeStorageDriver]);
		let qql=qm.qql;

		await qql({insertInto: "pages", set: {content: "hello world"}});
		await qql({insertInto: "pages", set: {content: "hello again"}});
		await qql({insertInto: "pages", set: {content: "hello third"}});

		let response=await fetch("http://localhost:3000/");
		let responseBody=await response.text();

		//console.log(responseBody);

		let dom=new JSDOM(responseBody,{runScripts: undefined});
		let el=dom.window.document.getElementById("isoq");

		expect(el.innerHTML).toContain("p-5");
		expect(el.children[0].children.length).toEqual(3);
		expect(el.children[0].children[0].innerHTML).toEqual("hello world");

		expect(el.children[1].innerHTML).toEqual("it worked: 456");

		let rpc=createRpcProxy({url: "http://localhost:3000/rpc"});
		let rpcRes=await rpc.testFunc(123);
		expect(rpcRes).toEqual("it worked: 123");


		//console.log(el.children[0].children.length);//firstChild.innerHTML);//children.length);

		//content=dom.window.document.getElementById("isoq").innerHTML.trim();
		//console.log(content);
		//expect(content).toEqual(`<div class="p-5">hello</div>`);
	});
})