import {jitBrowserTailwindcss} from "@mhsdesign/jit-browser-tailwindcss/dist/module.esm.js";
import {findMatchingFiles, mkdirRecursive} from "./fs-util.js";
import path from "path-browserify";

export async function build(buildEv) {
	console.log("Building tailwind...");
	let packageJsonPath=path.join(buildEv.cwd,"package.json");
	let packageJson=JSON.parse(await buildEv.fsPromises.readFile(packageJsonPath,"utf8"));
	if (!packageJson.exports.browser)
		throw new Error("No app entry point.");

	let mainParts=path.parse(path.resolve(buildEv.cwd,packageJson.exports.browser));
	let inputFn=path.join(mainParts.dir,mainParts.name+".css");
	let outputFn=path.join(buildEv.cwd,buildEv.options.publicDir,mainParts.name+".css");
	let input=await buildEv.fsPromises.readFile(inputFn,"utf8");
	//console.log("tailwind input: "+input);

	await mkdirRecursive(buildEv.fsPromises,path.join(buildEv.cwd,buildEv.options.publicDir));

	let conf=(await buildEv.import(path.join(buildEv.cwd,"tailwind.config.js"))).default;
	let fileNames=await findMatchingFiles(buildEv.fsPromises,buildEv.cwd,conf.content);
	let source="";
	for (let fileName of fileNames)
		source+=await buildEv.fsPromises.readFile(path.resolve(buildEv.cwd,fileName),"utf8");
	//console.log("tailwind source files:",fileNames);

	let output=await jitBrowserTailwindcss(input,source,conf);
	await buildEv.fsPromises.writeFile(outputFn,output);

	//console.log("Tailwind output: "+output);
}