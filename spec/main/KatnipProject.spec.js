import KatnipProject from "../../src/main/KatnipProject.js";
import path from "node:path";
import {fileURLToPath} from 'node:url';
import fs, {promises as fsp} from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("KatnipProject",()=>{
	it("can create a provision env",async ()=>{
		await fsp.rm(path.join(__dirname,"testproject/quickmin.db"),{force: true});
		await fsp.rm(path.join(__dirname,"testproject/public/index.css"),{force: true});

		let katnipProject=new KatnipProject({
			cwd: path.join(__dirname,"testproject")
		});

		await katnipProject.load();

		let env=await katnipProject.createProvisionEnv();

		let qql=env.qql;
		await qql.migrate();
		await qql({insertInto: "pages", set: {content: "hello world"}});
		await qql({insertInto: "pages", set: {content: "hello again"}});
		await qql({insertInto: "pages", set: {content: "hello third"}});

		let pages=await qql({manyFrom: "pages"});
		expect(pages.length).toEqual(3);
	});
});