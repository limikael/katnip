import KatnipCli from "../../src/cli/KatnipCli.js";
import path from "path";
import fs from "fs";
import {createQqlClient} from "qql";

describe("hello-cloudflare",()=>{
    beforeEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });

	it("works",async ()=>{
		let cwd=path.join(process.cwd(),"examples/hello-cloudflare/");

		fs.rmSync(path.join(cwd,".wrangler"),{recursive: true, force: true});
		fs.rmSync(path.join(cwd,"wrangler.json"),{force: true});

		let katnipCli=new KatnipCli({
			argv: ["node","katnip","dev","--platform=cloudflare"],
			cwd: cwd,
		});

		await katnipCli.run();

		let response=await fetch("http://localhost:3000/");
		let result=await response.text();
		expect(result).toContain("hello cloudflare page");

		let contentResponse=await fetch("http://localhost:3000/hello.txt");
		let contentResult=await contentResponse.text();
		expect(contentResult).toEqual("hello cloudflare content");

		let qql=createQqlClient({
			url: "http://localhost:3000/admin/_qql",
			headers: {
				"x-api-key": "helloworld"
			}
		});

		await qql({insertInto: "pages",set: {title: "hello db page"}});

		let dbResponse=await fetch("http://localhost:3000/");
		let dbResult=await dbResponse.text();
		expect(dbResult).toContain("hello cloudflare page");
		expect(dbResult).toContain("hello db page");

		await katnipCli.stop();
	});
});