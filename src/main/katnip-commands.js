import {AsyncEvent} from "../utils/async-events.js";
import KatnipProject from "./KatnipProject.js";
import {getEffectiveCwd} from "../utils/node-util.js";
import {QqlDriverLibSql} from "quickmin/qql";
import {createClient} from "@libsql/client";

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

export async function katnipCreateProvisionEnv(options={}) {
	if (!options.cwd)
		options.cwd=await getEffectiveCwd(process.cwd());

	if (!options.platform)
		options.platform="node";

	let project=new KatnipProject(options);
	await project.runCommand("provision",options);

	return project.env;
}

export async function katnipCreateTestEnv(options={}) {
	if (!options.cwd)
		options.cwd=await getEffectiveCwd(process.cwd());

	if (options.silent===undefined)
		options.silent=true;

	options.mode="test";
	let project=new KatnipProject(options);
	await project.runCommand("provision",options);

	return project.env;
}
