import {mikrokatClean} from "mikrokat";
import KatnipProject from "./KatnipProject.js";
import {getEffectiveCwd} from "../utils/node-util.js";

async function initOptions(options) {
	options={...options};

	if (!options.port)
		options.port=3000;

	if ((options.silent || options.quiet) && !options.log)
		options.log=false;

	return options;
}

export async function katnipInit(options) {
	options=await initOptions(options);
	let project=new KatnipProject(options);

	await project.init();
}

export async function katnipServe(options) {
	options.cwd=await getEffectiveCwd(options.cwd);
	options=await initOptions(options);
	let project=new KatnipProject(options);
	await project.load();
	await project.serve();

	async function stop() {
		await project.close();
	}

	return {stop};
}

export async function katnipBuild(options) {
	options.cwd=await getEffectiveCwd(options.cwd);
	options=await initOptions(options);
	let project=new KatnipProject(options);
	await project.load();
	await project.build();
}

export async function katnipProvision(options) {
	options.cwd=await getEffectiveCwd(options.cwd);
	options=await initOptions(options);
	let project=new KatnipProject(options);
	await project.load();
	await project.provision();
}

export async function katnipDeploy(options) {
	options.cwd=await getEffectiveCwd(options.cwd);
	options=await initOptions(options);
	let project=new KatnipProject(options);
	await project.load();
	await project.deploy();
}

export async function katnipClean(options) {
	await mikrokatClean(options);
}

export async function katnipCreateProvisionEnv(options={}) {
	options.cwd=await getEffectiveCwd(options.cwd);
	options=await initOptions(options);
	let project=new KatnipProject(options);
	await project.load();

	return await project.createProvisionEnv();
}

export async function katnipCreateTestEnv(options={}) {
	options.cwd=await getEffectiveCwd(options.cwd);
	options=await initOptions(options);
	let project=new KatnipProject(options);
	await project.load();

	return await project.createTestEnv();
}