import KatnipCli from "../../src/cli/KatnipCli.js";
import path from "path";
import fs from "fs";

describe("katnip-tailwind",()=>{
	it("scaffolds a config file",async ()=>{
		fs.rmSync("tmp/test-katnip-tailwind",{recursive: true, force: true});
		fs.mkdirSync("tmp/test-katnip-tailwind",{recursive: true});
		fs.mkdirSync("tmp/test-katnip-tailwind/node_modules",{recursive: true});
		fs.symlinkSync("../../../packages/katnip-tailwind","tmp/test-katnip-tailwind/node_modules/katnip-tailwind")

		let pkg={
			"name": "test-katnip-tailwind",
			"type": "module",
			"dependencies": {
				"katnip-tailwind": "latest"
			}
		}

		fs.writeFileSync("tmp/test-katnip-tailwind/package.json",JSON.stringify(pkg,null,2));

		let katnipCli=new KatnipCli({
			argv: ["node","katnip","init"],
			cwd: path.join(process.cwd(),"tmp/test-katnip-tailwind/"),
		});

		await katnipCli.run();

		expect(fs.existsSync("tmp/test-katnip-tailwind/tailwind.config.js")).toBeTrue();
	});
});