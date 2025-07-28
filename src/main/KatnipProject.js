import path from "node:path";
import fs, {promises as fsp} from "fs";
import {fileURLToPath} from 'node:url';
import {Command} from 'commander';
import {AsyncEvent, AsyncEventTarget} from "../utils/async-events.js";
import {processProjectFile, resolveProjectEntrypoints} from "./project-util.js";
import {DeclaredError} from "../utils/js-util.js";
import JSON5 from "json5";
import {loadTaggedEnv} from "../utils/env-util.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

export default class KatnipProject extends AsyncEventTarget {
	constructor({cwd, platform, log, silent}) {
		super();

		this.platform=platform;
		if (!this.platform)
			this.platform="node";

		this.eventCommands={};

		this.cwd=cwd;
		this.program=new Command();
		this.program.name("katnip")
			.description("Zero conf web framework.")
			.passThroughOptions()
			.allowExcessArguments()
			.option("--cwd <cwd>","Run as if started from this dir.");

		this.eventCommand("init")
			.description("Initialize project.");

		this.logger=log;
		if (!this.logger && !silent)
			this.logger=(...args)=>console.log(...args);

		this.addEventListener("build",ev=>{
			this.log("Build: "+this.platform);
			ev.env={...this.env}
			ev.importModules={};
		},{priority: 0});

		this.addEventListener("provision",ev=>{
			this.log("Provision: "+this.platform);
			ev.env={...this.env};
		},{priority: 0});
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
			await this.dispatchEvent(new AsyncEvent(name,options));
		});

		return command;
	}

	async load({allowMissingPkg}={}) {
		let entrypoints=await this.resolveEntrypoints("katnip-project-hooks",{allowMissingPkg});
		for (let entrypoint of entrypoints) {
			await this.addListenerModule(await import(entrypoint));
		}

		this.env={
			CWD: this.cwd,
			PLATFORM: this.platform,
			...await loadTaggedEnv(this.cwd,[this.platform,"local"])
		};

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
}