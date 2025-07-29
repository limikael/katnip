import {AsyncEvent} from "../utils/async-events.js";
import KatnipProject from "./KatnipProject.js";

export async function katnipCommand(options) {
	if (!options.platform)
		options.platform="node";

	let project=new KatnipProject(options);
	await project.load();
	return await project.dispatchEvent(new AsyncEvent(options.command,options));
}

export async function katnipServe(options) {
	return await katnipCommand({command: "serve", ...options});
}

export async function katnipProvision(options) {
	return await katnipCommand({command: "provision", ...options});
}

export async function katnipCreateProvisionEnv(options) {
	if (!options.platform)
		options.platform="node";

	let project=new KatnipProject(options);
	await project.load();

	let provisionEvent=new AsyncEvent("provision",options);
	await project.dispatchEvent(provisionEvent);

	return provisionEvent.env;
}