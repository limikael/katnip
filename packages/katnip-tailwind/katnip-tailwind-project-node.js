import path from "path";
import {fileURLToPath} from 'url';
import {DeclaredError, findNodeBin, resolveHookEntryPoints, runCommand} from "katnip";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INDEX_CSS=
`@tailwind base;
@tailwind components;
@tailwind utilities;
`;

const TAILWIND_CONFIG_JS=
`module.exports = {
  content: ["./src/**/*.jsx"],
  theme: {
    extend: {
    }
  }
}
`;

init.priority=15;
export function init(ev) {
	/*let packageJson=JSON.parse(fs.readFileSync("package.json","utf8"));
	if (!packageJson.exports?.browser)
		throw new DeclaredError("No browser entry point in package.json");

	let mainParts=path.parse(packageJson.exports.browser);
	let input=path.join(mainParts.dir,mainParts.name+".css");

	if (!fs.existsSync(input)) {
		console.log("Creating "+input);
		fs.writeFileSync(input,INDEX_CSS);
	}

	let tailwindConfigFile="tailwind.config.js";
	if (!fs.existsSync(tailwindConfigFile)) {
		console.log("Creating "+tailwindConfigFile);
		fs.writeFileSync(tailwindConfigFile,TAILWIND_CONFIG_JS);
	}*/
}

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

	let modulePaths=await resolveHookEntryPoints(ev.cwd,"isomain",{
		fs: ev.fs,
		keyword: "katnip-plugin"
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
