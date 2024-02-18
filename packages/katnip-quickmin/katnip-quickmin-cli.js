import fs from "fs";
import {parse as parseYaml} from "yaml";
import {fileURLToPath} from 'url';
import path from "path";
import {findNodeBin, runCommand} from "katnip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

initcli.priority=20;
export async function initcli(spec) {
	spec.addCommandOption("dev","risky",{
		description: "Perform risky schema migration.",
		type: "boolean"
	});
}

export async function dev(ev) {
	let quickminBin=await findNodeBin(__dirname,"quickmin");
	let quickminArgs=["migrate"];
	if (ev.options.risky)
		quickminArgs.push("--risky");

	await runCommand(quickminBin,quickminArgs,{passthrough: true});
}

export async function build(ev) {
	let conf=parseYaml(fs.readFileSync("quickmin.yaml","utf8"));

	ev.data.quickminConf=conf;
}