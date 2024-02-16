import path from "path";
import {fileURLToPath} from 'url';
import {DeclaredError, findNodeBin, findKatnipModules, runCommand} from "katnip";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function initcli(spec) {
	spec.addGlobalOption("publicDir",{
		description: "Directory to serve as plain static assets.",
		default: "public"
	});
}

export async function build(ev) {
	console.log("Building tailwind...");
	let tailwind=await findNodeBin(process.cwd(),"tailwind");
	/*if (!tailwind)
		tailwind=await findNodeBin(__dirname,"tailwind");

	if (!tailwind)
		throw new Error("Can't find tailwind binary");*/

	let modulePaths=findKatnipModules("browser",{
		reqConditions: "browser"
	});
	if (modulePaths.length!=1)
		throw new Error("Expected 1 browser entry point, found "+modulePaths.length);

	let mainParts=path.parse(modulePaths[0]);
	let input=path.join(mainParts.dir,mainParts.name+".css");
	let output=path.join(ev.options.publicDir,mainParts.name+".css");

	await runCommand(tailwind,[
		"--minify",
		"-i",input,
		"-o",output
	],{passthrough: true});
}
