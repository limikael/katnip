import path from "node:path";
import fs, {promises as fsp} from "fs";
import {fileURLToPath} from 'node:url';
import {Command} from 'commander';
import {AsyncEvent, AsyncEventTarget} from "../utils/async-events.js";
import {processProjectFile, resolveProjectEntrypoints} from "./project-util.js";
import {DeclaredError} from "../utils/js-util.js";
import JSON5 from "json5";
import {loadTaggedEnv} from "../utils/env-util.js";
import {getPackageVersion} from "../utils/node-util.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

export default class KatnipProject extends AsyncEventTarget {
	constructor({cwd, platform, log, silent}) {
		super();

		this.platform=platform;
		if (!this.platform)
			this.platform="node";

		this.eventCommands={};
		this.excludedRuntimeEnvKeys=[];

		this.cwd=cwd;
		this.program=new Command();
		this.program.name("katnip")
			.description("Zero conf web framework.")
			.passThroughOptions()
			.allowExcessArguments()
			.option("--cwd <cwd>","Run as if started from this dir.")
			.option("--platform <platform>","Specify platform.");

		this.eventCommand("init")
			.description("Initialize project.");

		this.logger=log;
		if (!this.logger && !silent)
			this.logger=(...args)=>console.log(...args);

		this.addEventListener("*",ev=>{
			ev.env=this.env;
		},{priority: 0});

		this.addEventListener("build",ev=>{
			this.log("Build: "+this.platform);
			ev.getRuntimeEnv=()=>this.getRuntimeEnv();
			ev.importModules={};
		},{priority: 0});

		this.addEventListener("provision",ev=>{
			this.log("Provision: "+this.platform);
		},{priority: 0});
	}

	getRuntimeEnv() {
		let runtimeEnv={};
		for (let key in this.env)
			if (!this.excludedRuntimeEnvKeys.includes(key))
				runtimeEnv[key]=this.env[key];

		return runtimeEnv;
	}

	excludeFromRuntimeEnv(key) {
		if (!this.excludedRuntimeEnvKeys.includes(key))
			this.excludedRuntimeEnvKeys.push(key);
	}

	log=(...args)=>{
		if (this.logger)
			this.logger(...args);
	}

	eventCommand(name) {
		if (this.eventCommands[name])
			return this.eventCommands[name];

		let command=this.program.command(name);
		this.eventCommands[name]=command;
		command.action(async (options)=>{
			if (options.platform && options.platform!=this.platform)
				throw new Error("Changing platform?");

			await this.dispatchEvent(new AsyncEvent(name,options));
		});

		return command;
	}

	async load({allowMissingPkg}={}) {
		let entrypoints=await this.resolveEntrypoints("katnip-project-hooks",{allowMissingPkg});
		for (let entrypoint of entrypoints) {
			await this.addListenerModule(await import(entrypoint));
		}

		if (!this.platform)
			throw new Error("No platform when loading");

		//console.log("load: "+this.platform);

		this.env={
			PLATFORM: this.platform,
			...await loadTaggedEnv(this.cwd,[this.platform,"local"])
		};

		if (this.platform=="node")
			this.env.CWD=this.cwd;

		this.env.config={};
		if (fs.existsSync(path.join(this.cwd,"katnip.json")))
			this.env.config=JSON5.parse(await fsp.readFile(path.join(this.cwd,"katnip.json")));

		await this.dispatchEvent(new AsyncEvent("initCli"));
	}

	async resolveEntrypoints(importPath, {conditions, allowMissingPkg}={}) {
		return await resolveProjectEntrypoints({
			cwd: this.cwd,
			defaultPluginPath: path.join(__dirname,"../../packages"),
			importPath,
			conditions,
			allowMissingPkg
		});
	}

	async processProjectFile(filename, format, processor) {
		let content=await processProjectFile({
			cwd: this.cwd,
			filename,
			format,
			processor
		});

		return content;
	}

	async getKatnipVersion() {
		return await await getPackageVersion(path.join(__dirname,"../.."));
	}
}