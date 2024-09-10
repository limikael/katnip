import {jitBrowserTailwindcss} from "@mhsdesign/jit-browser-tailwindcss/dist/module.esm.js";
import {findMatchingFiles, mkdirRecursive} from "./fs-util.js";
import path from "path-browserify";
import {resolveHookEntryPoints} from "katnip";

export async function build(buildEv) {
	console.log("Building tailwind, public="+buildEv.options.publicDir);

	let input=`
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #isoq {
	height: 100%;
	min-height: 100%;
}
`;

	/*let modulePaths=await resolveHookEntryPoints(buildEv.cwd,"isomain",{
		fs: buildEv.fs,
		keyword: "katnip-plugin"
	});

	if (!modulePaths.length) {
		console.log("No tailwind css found, using default.")
	}

	else {
		if (modulePaths.length!=1)
			throw new Error("Expected 1 browser entry point, found "+modulePaths.length);

		let mainParts=path.parse(modulePaths[0]);
		let inputFn=path.join(mainParts.dir,mainParts.name+".css");
		input=await buildEv.fsPromises.readFile(inputFn,"utf8");
	}*/

	//console.log("tailwind input: "+input);

	let conf=(await buildEv.import(path.join(buildEv.cwd,"tailwind.config.js"))).default;
	let fileNames=await findMatchingFiles(buildEv.fsPromises,buildEv.cwd,conf.content);
	let source="";
	for (let fileName of fileNames)
		source+=await buildEv.fsPromises.readFile(path.resolve(buildEv.cwd,fileName),"utf8");
	//console.log("tailwind source files:",fileNames);

	let output=await jitBrowserTailwindcss(input,source,conf);

	//console.log("tw build, publicDir="+buildEv.options.publicDir);

	if (buildEv.options.publicDir) {
		await mkdirRecursive(buildEv.fsPromises,path.join(buildEv.cwd,buildEv.options.publicDir));
		let outputFn=path.join(buildEv.cwd,buildEv.options.publicDir,"index.css");
		await buildEv.fsPromises.writeFile(outputFn,output);
	}

    if (!buildEv.options.publicDir || buildEv.options.exposeIndexCss)
		buildEv.data.indexCss=output;

	//console.log("Tailwind output: "+output);
}