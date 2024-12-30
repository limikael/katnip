import KatnipCli from "../../src/cli/KatnipCli.js";
import path from "path";
import fs from "fs";

describe("katnip-quickmin",()=>{
	it("works",async ()=>{
		fs.rmSync("tmp/test-katnip-quickmin",{recursive: true, force: true});
		fs.mkdirSync("tmp/test-katnip-quickmin",{recursive: true});
		fs.mkdirSync("tmp/test-katnip-quickmin/node_modules",{recursive: true});
		fs.symlinkSync("../../../packages/katnip-quickmin","tmp/test-katnip-quickmin/node_modules/katnip-quickmin")

		let pkg={
			"name": "test-katnip-quickmin",
			"type": "module",
			"dependencies": {
				"katnip-quickmin": "latest"
			}
		}

		fs.writeFileSync("tmp/test-katnip-quickmin/package.json",JSON.stringify(pkg,null,2));

		let katnipCli=new KatnipCli({
			argv: ["node","katnip","init"],
			cwd: path.join(process.cwd(),"tmp/test-katnip-quickmin/"),
		});

		await katnipCli.run();

		expect(fs.existsSync("tmp/test-katnip-quickmin/quickmin.yaml")).toBeTrue();
	});
});