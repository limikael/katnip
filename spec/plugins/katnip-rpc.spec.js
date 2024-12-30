import KatnipCli from "../../src/cli/KatnipCli.js";
import path from "path";
import fs from "fs";

describe("katnip-rpc",()=>{
	it("scaffolds an entry point",async ()=>{
		fs.rmSync("tmp/test-katnip-rpc",{recursive: true, force: true});
		fs.mkdirSync("tmp/test-katnip-rpc",{recursive: true});
		fs.mkdirSync("tmp/test-katnip-rpc/node_modules",{recursive: true});
		fs.symlinkSync("../../../packages/katnip-rpc","tmp/test-katnip-rpc/node_modules/katnip-rpc")

		let pkg={
			"name": "test-katnip-rpc",
			"type": "module",
			"dependencies": {
				"katnip-rpc": "latest"
			}
		}

		fs.writeFileSync("tmp/test-katnip-rpc/package.json",JSON.stringify(pkg,null,2));

		let katnipCli=new KatnipCli({
			argv: ["node","katnip","init"],
			cwd: path.join(process.cwd(),"tmp/test-katnip-rpc/"),
		});

		await katnipCli.run();

		expect(fs.existsSync("tmp/test-katnip-rpc/src/main/Api.js")).toBeTrue();
	});
});