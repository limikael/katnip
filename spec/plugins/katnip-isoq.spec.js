import KatnipCli from "../../src/cli/KatnipCli.js";
import path from "path";
import fs from "fs";

describe("katnip-isoq",()=>{
	it("works",async ()=>{
		fs.rmSync("tmp/test-katnip-isoq",{recursive: true, force: true});
		fs.mkdirSync("tmp/test-katnip-isoq",{recursive: true});
		fs.mkdirSync("tmp/test-katnip-isoq/node_modules",{recursive: true});
		fs.symlinkSync("../../../packages/katnip-isoq","tmp/test-katnip-isoq/node_modules/katnip-isoq")

		let pkg={
			"name": "test-katnip-isoq",
			"type": "module",
			"dependencies": {
				"katnip-isoq": "latest"
			}
		}

		fs.writeFileSync("tmp/test-katnip-isoq/package.json",JSON.stringify(pkg,null,2));

		let katnipCli=new KatnipCli({
			argv: ["node","katnip","init"],
			cwd: path.join(process.cwd(),"tmp/test-katnip-isoq/"),
		});

		await katnipCli.run();

		expect(fs.existsSync("tmp/test-katnip-isoq/src/main/index.jsx")).toBeTrue();

		katnipCli=new KatnipCli({
			argv: ["node","katnip","init"],
			cwd: path.join(process.cwd(),"tmp/test-katnip-isoq/"),
		});

		await katnipCli.run();
	});

	it("runs init as part of build",async ()=>{
		fs.rmSync("tmp/test-build-init",{recursive: true, force: true});
		fs.mkdirSync("tmp/test-build-init",{recursive: true});
		fs.mkdirSync("tmp/test-build-init/node_modules",{recursive: true});
		fs.symlinkSync("../../../packages/katnip-isoq","tmp/test-build-init/node_modules/katnip-isoq")

		let pkg={
			"name": "test-build-init",
			"type": "module",
			"dependencies": {
				"katnip-isoq": "latest"
			}
		}

		fs.writeFileSync("tmp/test-build-init/package.json",JSON.stringify(pkg,null,2));

		let katnipCli=new KatnipCli({
			argv: ["node","katnip","dev"],
			cwd: path.join(process.cwd(),"tmp/test-build-init/"),
		});

		await katnipCli.run();

		expect(fs.existsSync("tmp/test-build-init/src/main/index.jsx")).toBeTrue();

		await katnipCli.stop();
	});
});