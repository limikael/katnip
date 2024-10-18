import {jitBrowserTailwindcss} from "@mhsdesign/jit-browser-tailwindcss/dist/module.esm.js";
import {findMatchingFiles, mkdirRecursive} from "./fs-util.js";
import path from "path-browserify";
import {resolveHookEntryPoints} from "katnip";

async function buildTailwind(ev) {
	let input=`
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #isoq {
	height: 100%;
	min-height: 100%;
}
`;

	let conf=(await ev.import(path.join(ev.cwd,"tailwind.config.js"))).default;
	let fileNames=await findMatchingFiles(ev.fs.promises,ev.cwd,conf.content);
	let source="";
	for (let fileName of fileNames)
		source+=await ev.fs.promises.readFile(path.resolve(ev.cwd,fileName),"utf8");
	//console.log("tailwind source files:",fileNames);

	let output=await jitBrowserTailwindcss(input,source,conf);

	return ({
		css: output,
		tailwindConfig: conf
	});
}

export async function editorData(editorData, ev) {
	//console.log("editor data in tailwind plugin...");
	let artifact=await buildTailwind(ev);

	editorData.css=artifact.css;
	editorData.tailwindConfig=artifact.tailwindConfig;
}

export async function build(buildEv) {
	//console.log("Building tailwind updated, public="+buildEv.options.publicDir);

	let artifact=await buildTailwind(buildEv);
	let output=artifact.css; //await buildTailwind(buildEv);

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