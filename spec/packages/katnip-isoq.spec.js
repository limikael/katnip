import {katnipServe, katnipCreateProvisionEnv} from "katnip";
import path from "node:path";
import {fileURLToPath} from 'node:url';
import fs, {promises as fsp} from "fs";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

describe("katnip-isoq",()=>{
	it("can serve iso",async ()=>{
		await fsp.rm(path.join(__dirname,"test-project/quickmin.db"),{force: true});

		let env=await katnipCreateProvisionEnv({
			cwd: path.join(__dirname,"test-project"),
			silent: true
		});

		await env.qql({insertInto: "pages",set: {content: "page1"}});
		await env.qql({insertInto: "pages",set: {content: "page2"}});

		let server=await katnipServe({
			cwd: path.join(__dirname,"test-project"),
			port: 3000,
			silent: true,
		});

		let response=await fetch("http://localhost:3000/");
		let result=await response.text();
		//console.log(result);

		expect(result).toContain("hello isoq");
		expect(result).toContain(`<div id="isoq"`);
		expect(result).toContain(`"content":"page1"`);
		expect(result).toContain(`"content":"page2"`);

		await server.stop();
	});
});