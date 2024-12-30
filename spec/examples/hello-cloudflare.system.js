import KatnipCli from "../../src/cli/KatnipCli.js";
import path from "path";
import fs from "fs";
import {createQqlClient} from "qql";

describe("hello-cloudflare",()=>{
    beforeEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
    });

	it("works",async ()=>{
		let cwd=path.join(process.cwd(),"examples/hello-cloudflare/");

		fs.rmSync(path.join(cwd,".wrangler"),{recursive: true, force: true});
		fs.rmSync(path.join(cwd,"wrangler.json"),{force: true});

		let katnipCli;
		katnipCli=new KatnipCli({
			argv: ["node","katnip","deploy","--platform=cloudflare"],
			cwd: cwd,
		});

		await katnipCli.run();

		let wranglerPath=path.join(cwd,"wrangler.json");
		let wrangler=JSON.parse(fs.readFileSync(wranglerPath));
		expect(wrangler.r2_buckets[0].bucket_name).toEqual("hello-cloudflare");
		expect(wrangler.d1_databases[0].database_id).not.toEqual("undefined");

		katnipCli=new KatnipCli({
			argv: ["node","katnip","deploy","--platform=cloudflare"],
			cwd: cwd,
		});

		await katnipCli.run();

		katnipCli=new KatnipCli({
			argv: ["node","katnip","undeploy","--platform=cloudflare"],
			cwd: cwd,
		});

		await katnipCli.run();

		wrangler=JSON.parse(fs.readFileSync(wranglerPath));
		expect(wrangler.r2_buckets[0].bucket_name).toEqual("undefined");
		expect(wrangler.d1_databases[0].database_id).toEqual("undefined");
	});
});