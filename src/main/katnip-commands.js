import {AsyncEvent} from "../utils/async-events.js";
import KatnipProject from "./KatnipProject.js";

export async function katnipCommand(options) {
	let project=new KatnipProject(options);
	await project.load();
	return await project.dispatchEvent(new AsyncEvent(options.command,options));
}

export async function katnipServe(options) {
	return await katnipCommand({command: "serve", ...options});
}