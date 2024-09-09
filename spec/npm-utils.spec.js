import {findKeywordDependencies, resolveModuleDir, resolveHookEntryPoints} from "../src/utils/npm-util.js";
import fs from "fs";
import path from "path-browserify";

describe("npm-utils",()=>{
	it("can resolve a module dir",async ()=>{
		let dir;
		let absPackageDir=path.join(process.cwd(),"spec/data/package");

		dir=await resolveModuleDir(absPackageDir,"noplugin",{fs});
		expect(dir).toContain("node_modules");
		//console.log(dir);

		dir=await resolveModuleDir(absPackageDir,"@bla/aplugin",{fs});
		expect(dir).toContain("node_modules");
		//console.log(dir);

		dir=await resolveModuleDir(absPackageDir,"semver",{fs});
		expect(dir).toContain("node_modules");
		//console.log(dir);

		await expectAsync((async()=>{
			dir=await resolveModuleDir(absPackageDir,"noexist",{fs});
			//console.log(dir);
		})()).toBeRejected();
	})

	it("can find keyword deps",async ()=>{
		let absPackageDir=path.join(process.cwd(),"spec/data/package");
		let dirs=await findKeywordDependencies(absPackageDir,"katnip-plugin",{fs});
		//console.log(dirs);
		expect(dirs.length).toEqual(3);
	});

	it("can find hook entry points",async ()=>{
		let absPackageDir=path.join(process.cwd(),"spec/data/package");
		let eps=await resolveHookEntryPoints(absPackageDir,{
			fs: fs,
			keyword: "katnip-plugin",
			importPath: "myentry",
/*			dontResolve: [
				"katnip-isoq/myentry",
//				"katnip-isoq/myentry2"
			]*/
		});

		console.log(eps);

		//console.log(eps);
		expect(eps.length).toEqual(2);
	})
});