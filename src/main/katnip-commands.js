import {AsyncEvent} from "../utils/async-events.js";
import KatnipProject from "./KatnipProject.js";

export async function katnipCommand(options) {
	if (!options.platform)
		options.platform="node";

	let project=new KatnipProject(options);
	return await project.runCommand(options.command,options);
}

export async function katnipStart(options) {
	return await katnipCommand({command: "start", ...options});
}

export async function katnipProvision(options) {
	return await katnipCommand({command: "provision", ...options});
}

export async function katnipCreateProvisionEnv(options) {
	if (!options.platform)
		options.platform="node";

	let project=new KatnipProject(options);
	await project.runCommand("provision",options);

	return project.env;
}