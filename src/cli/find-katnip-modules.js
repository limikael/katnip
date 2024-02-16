import path from "path";
import {fileURLToPath} from 'url';
import minimist from "minimist";
import {resolveModuleEntryPoint} from "../utils/node-util.js";
import findNodeModules from "find-node-modules";
import fs from "fs";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

export function findKatnipModules(condition, args={}) {
	let modulePaths=[];
	let fn;

	let defPluginDir=path.join(__dirname,"../katnip-server");
	fn=resolveModuleEntryPoint(defPluginDir,condition,args);
	if (fn)
		modulePaths.push(fn);

	if (fs.existsSync(path.join(process.cwd(),"package.json"))) {
		fn=resolveModuleEntryPoint(process.cwd(),condition,args);
		if (fn)
			modulePaths.push(fn);
	}

	let dirs=findNodeModules({cwd: process.cwd(), relative: false});
	for (let dir of dirs) {
		let subdirs=fs.readdirSync(dir)
		for (let subdir of subdirs) {
			let packageDir=path.join(dir,subdir);
			let packageJsonPath=path.join(packageDir,"package.json");
			if (fs.existsSync(packageJsonPath)) {
				let pkgJson=fs.readFileSync(packageJsonPath);
				let pkg=JSON.parse(pkgJson);

				if (pkg.keywords && pkg.keywords.includes("katnip-plugin")) {
					let fn=resolveModuleEntryPoint(packageDir,condition,args);
					if (fn)
						modulePaths.push(fn);
				}
			}
		}
	}

	return modulePaths;
}