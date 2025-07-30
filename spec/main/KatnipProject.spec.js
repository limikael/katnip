import KatnipProject from "../../src/main/KatnipProject.js";
import path from "node:path";
import {fileURLToPath} from 'node:url';
import fs,{promises as fsp} from "fs";
import {AsyncEvent} from "katnip"; //../../src/exports/exports-default.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

describe("KatnipProject",()=>{
	it("can resolve plugins",async ()=>{
		let projectCwd=path.join(__dirname,"test-project");
		let project=new KatnipProject({cwd: projectCwd});
		await fsp.rm(path.join(__dirname,"test-project/node_modules"),{force: true, recursive: true});
		await fsp.cp(path.join(__dirname,"test-project/node_modules.keep"),path.join(__dirname,"test-project/node_modules"),{recursive: true});

		let deps;
		deps=await project.resolveEntrypoints("katnip-project-hooks");
		//expect(deps.length).toEqual(4);
		//console.log(deps);

		deps=await project.resolveEntrypoints("katnip-project-hooks",{conditions: ["browser"]});
		//expect(deps.length).toEqual(3);
		//console.log(deps);
	});

	it("can initialize a project",async()=>{
		let projectCwd=path.join(__dirname,"../../tmp/test-init-project");
		await fsp.rm(projectCwd,{force: true, recursive: true});

		let project=new KatnipProject({cwd: projectCwd, silent: true});
		await project.runCommand("init",{});

		/*await project.load({allowMissingPkg: true});
		await project.dispatchEvent(new AsyncEvent("init"));*/
		//await project.dispatchEvent(new AsyncEvent("init"));

		let pkg=JSON.parse(await fsp.readFile(path.join(projectCwd,"package.json")));
		expect(pkg.name).toEqual("test-init-project");
	});
});