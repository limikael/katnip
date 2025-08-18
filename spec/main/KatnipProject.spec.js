import KatnipProject from "../../src/main/KatnipProject.js";
import path from "node:path";
import {fileURLToPath} from 'node:url';
import fs,{promises as fsp} from "fs";
import {AsyncEvent, katnipInit} from "katnip"; //../../src/exports/exports-default.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

describe("KatnipProject",()=>{
	it("can resolve plugins",async ()=>{
		let projectCwd=path.join(__dirname,"test-project");
		let project=new KatnipProject({cwd: projectCwd});
		project.config={};
		await fsp.rm(path.join(__dirname,"test-project/node_modules"),{force: true, recursive: true});
		await fsp.cp(path.join(__dirname,"test-project/node_modules.keep"),path.join(__dirname,"test-project/node_modules"),{recursive: true});

		let deps;
		deps=await project.resolveEntrypoints("katnip-project-hooks");
		expect(deps.length).toEqual(8);
		//console.log(deps);

		deps=await project.resolveEntrypoints("katnip-project-hooks",{conditions: ["browser"]});
		expect(deps.length).toEqual(8);
		//console.log(deps);

		project.config.disablePlugins=["katnip-quickmin"];
		deps=await project.resolveEntrypoints("katnip-project-hooks",{conditions: ["browser"]});
		expect(deps.length).toEqual(7);
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

	it("can populate env",async()=>{
		let projectCwd=path.join(__dirname,"../../tmp/test-init-project");
		await fsp.rm(projectCwd,{force: true, recursive: true});

		await fsp.mkdir(projectCwd);
		await katnipInit({cwd: projectCwd, silent: true});

		//console.log(process.env);
		process.env.SOME_NEW_VAR="somenewvalue";

		await fsp.writeFile(path.join(projectCwd,".env"),"HELLO=123\nWORLD=testing");
		let project=new KatnipProject({cwd: projectCwd, mode: "dev"});
		await project.populateEnv();

		project.excludeFromRuntimeEnv("WORLD");

		expect(project.env.HELLO).toEqual("123");
		expect(project.env.SOME_NEW_VAR).toEqual("somenewvalue");
		//console.log(project.env);

		let baked=project.getRuntimeEnv();
		expect(baked.PLATFORM).toEqual("node");
		expect(baked.HELLO).toEqual("123");
		expect(baked.SOME_NEW_VAR).toBeUndefined();
		expect(baked.WORLD).toBeUndefined();
	});
});