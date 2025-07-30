import * as TOML from '@ltd/j-toml';
import path from "node:path";
import fs, {promises as fsp} from "fs";
import {resolveDependencies} from "../utils/package-util.js";
import {resolveImport, resolveAllExports} from "resolve-import";
import dotenv from "dotenv";
import {DeclaredError} from "../utils/js-util.js";

function escapeValue(value) {
	if (value == null) return "";
	const needsQuotes = /[\s#'"\\]/.test(value);
	const escaped = value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
	return needsQuotes ? `"${escaped.replace(/"/g, '\\"')}"` : escaped;
}

function dotenvStringify(envObj) {
	return Object.entries(envObj)
		.map(([key, value]) => `${key}=${escapeValue(value)}`)
		.join("\n")+"\n";
}

export async function processProjectFile({cwd, filename, format, processor}) {
	/*if (!fs.existsSync(cwd))
		await fsp.mkdir(cwd,{recursive: true});*/

	let filenameAbs=path.resolve(cwd,filename);
	//console.log(filenameAbs);

	let content;
	if (fs.existsSync(filenameAbs)) {
		content=await fsp.readFile(filenameAbs,"utf8");
	}

	switch (format) {
		case "json": content=content?JSON.parse(content):content; break;
		case "lines": content=content?content.split("\n").filter(s=>!!s):[]; break;
		case "toml": content=TOML.parse(content?content:""); break;
		case "dotenv": content=content?dotenv.parse(content):content; break;
		case null:
		case undefined:
			break;

		default: 
			throw new Error("Unknown config file format: "+format); 
			break;
	}

	if (processor) {
		let newContent=await processor(content);
		if (newContent!==undefined)
			content=newContent;
	}

	let textContent=content;
	switch (format) {
		case "json": textContent=JSON.stringify(textContent,null,2); break;
		case "lines": textContent=textContent.join("\n")+"\n"; break;
		case "toml":
			textContent=TOML.stringify(textContent,{
				newline: "\n",
				newlineAround: "section"
			});
			break;

		case "dotenv": textContent=dotenvStringify(textContent); break;
		case null:
		case undefined:
			break;

		default: 
			throw new Error("Unknown config file format for stringify: "+format); 
			break;
	}

	await fsp.mkdir(path.dirname(filenameAbs),{recursive: true});
	await fsp.writeFile(filenameAbs,textContent);

	return content;
}

export async function resolveProjectEntrypoints({cwd, importPath, conditions, allowMissingPkg, defaultPluginPath}) {
	let havePkg=fs.existsSync(path.join(cwd,"package.json"));
	if (!havePkg && !allowMissingPkg)
		throw new DeclaredError("No package.json found");

	if (!importPath.startsWith("./"))
		importPath="./"+importPath;

	let resPaths=[];

	// Default plugins.
	//let defaultPluginPath=path.join(__dirname,"../../packages");
	let dirs=await fsp.readdir(defaultPluginPath);
	for (let dir of dirs) {
		let pluginPath=path.join(defaultPluginPath,dir,"package.json");
		let allExports=await resolveAllExports(pluginPath,{conditions});
		//console.log(allExports);
		if (allExports[importPath])
			resPaths.push(allExports[importPath].pathname);
	}

	if (havePkg) {
		// Dependencies.
		let deps=await resolveDependencies(path.join(cwd,"package.json"));
		for (let [dep, depPkgJsonPath] of Object.entries(deps)) {
			let depPkgJson=JSON.parse(await fsp.readFile(depPkgJsonPath));
			if (depPkgJson.keywords && depPkgJson.keywords.includes("katnip-plugin")) {
				let allExports=await resolveAllExports(depPkgJsonPath,{conditions});
				if (allExports[importPath])
					resPaths.push(allExports[importPath].pathname);
			}
		}

		// Project.
		let projectPkgJsonPath=path.join(cwd,"package.json");
		let allExports=await resolveAllExports(projectPkgJsonPath,{conditions});
		if (allExports[importPath])
			resPaths.push(allExports[importPath].pathname);
	}

	return resPaths;
}
