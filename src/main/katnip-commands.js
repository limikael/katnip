import {AsyncEvent} from "../utils/async-events.js";
import KatnipProject from "./KatnipProject.js";

export async function katnipCommand(command, options={}) {
	let project=new KatnipProject(options);
	return await project.runCommand(command,options);
}

export async function katnipStart(options) {
	return await katnipCommand("start",options);
}

export async function katnipProvision(options) {
	return await katnipCommand("provision",options);
}

export async function katnipInit(options) {
	return await katnipCommand("init",options);
}

export async function katnipCreateProvisionEnv(options) {
	if (!options.platform)
		options.platform="node";

	let project=new KatnipProject(options);
	await project.runCommand("provision",options);

	return project.env;
}