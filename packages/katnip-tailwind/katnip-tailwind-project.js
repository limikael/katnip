import {tailwindBuild} from "./tailwind-util.js";
import path from "node:path";

export async function build(buildEv) {
	let project=buildEv.target;

	await tailwindBuild({
		cwd: project.cwd,
		config: path.join(project.cwd,"tailwind.config.js"),
		out: path.join(project.cwd,"public/index.css"),
		input: project.config.tailwindInput
	});
}