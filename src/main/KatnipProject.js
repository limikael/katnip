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
import EnvBakeMode from "./EnvBakeMode.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

export default class KatnipProject extends AsyncEventTarget {
	constructor({cwd, platform, mode, log, silent}) {
		super();

		this.platform=platform;
		if (!this.platform)
			this.platform="node";

		if (mode)
			this.mode=mode;

		this.eventCommands={};
		this.envBakeMode={};

		this.cwd=cwd;
		this.program=new Command();
		this.program.name("katnip")
			.description("Zero conf web framework.")
			.passThroughOptions()
			.allowExcessArguments()
			.option("--cwd <cwd>","Run as if started from this dir.")
			.option("--platform <platform>","Specify platform.")
			.option("--mode <mode>","Specify mode (prod/dev).");

		this.eventCommand("init")
			.allowMissingPkg()
			.description("Initialize project.");

		this.logger=log;
		if (!this.logger && !silent)
			this.logger=(...args)=>console.log(...args);

		this.addEventListener("*",ev=>{
			ev.env=this.env;
		},{priority: 0});

		this.addEventListener("build",ev=>{
			this.log("Build: "+this.platform+"/"+this.mode);
			ev.getRuntimeEnv=()=>this.getRuntimeEnv();
			ev.importModules={};
		},{priority: 0});

		this.addEventListener("provision",ev=>{
			this.log("Provision: "+this.platform+"/"+this.mode);
		},{priority: 0});
	}

	getRuntimeEnv() {
		let runtimeEnv={};
		for (let key in this.env) {
			if (!this.envBakeMode[key]) {
				runtimeEnv[key]=this.env[key];
			}

			else if (this.envBakeMode[key].mode=="different" &&
					this.env[key]!==this.envBakeMode[key].value) {
				runtimeEnv[key]=this.env[key];
			}
		}

		return runtimeEnv;
	}

	excludeFromRuntimeEnv(key) {
		this.envBakeMode[key]=new EnvBakeMode("never");
	}

	log=(...args)=>{
		if (this.logger)
			this.logger(...args);
	}

	eventCommand(name) {
		if (this.eventCommands[name])
			return this.eventCommands[name];

		let command=this.program.command(name);
		command.allowMissingPkg=()=>{
			command.isAllowMissingPkg=true;
			return command;
		}
		command.defaultMode=(mode)=>{
			command.commandDefaultMode=mode;
			return command;
		}
		this.eventCommands[name]=command;
		command.action(async (options)=>{
			let runOptions={...this.program.opts(),...options}

			if (runOptions.platform && runOptions.platform!=this.platform)
				throw new Error("Changing platform?");

			await this.runCommand(name,runOptions);
		});

		return command;
	}

	async load({allowMissingPkg}={}) {
		if (this.loaded)
			throw new Error("already loaded");

		this.loaded=true;

		let entrypoints=await this.resolveEntrypoints("katnip-project-hooks",{allowMissingPkg});
		for (let entrypoint of entrypoints) {
			await this.addListenerModule(await import(entrypoint));
		}

		if (!this.platform)
			throw new Error("No platform when loading");

		await this.dispatchEvent(new AsyncEvent("initCli"));

		//console.log("load: "+this.platform);
	}

	async populateEnv() {
		if (!this.platform)
			throw new Error("Need platform to populate env");

		let tags=[this.platform,"local"];
		switch (this.mode) {
			case "dev":
				tags.push("dev","development");
				break;

			case "prod":
				tags.push("prod","production");
				break;

			default:
				throw new Error("Unknown mode: "+this.mode);
		}

		this.env=await loadTaggedEnv(this.cwd,tags);
		this.env={...this.env,...process.env};

		for (let key in process.env)
			this.envBakeMode[key]=new EnvBakeMode("different",process.env[key]);

		delete this.envBakeMode["PLATFORM"];

		this.env.PLATFORM=this.platform;
		if (this.platform=="node") {
			delete this.envBakeMode["CWD"];
			this.env.CWD=this.cwd;
		}

		this.env.config={};
		if (fs.existsSync(path.join(this.cwd,"katnip.json")))
			this.env.config=JSON5.parse(await fsp.readFile(path.join(this.cwd,"katnip.json")));
	}

	async runCommand(command, options) {
		let allowMissingPkg=false;
		if (this.eventCommands[command] &&
				this.eventCommands[command].isAllowMissingPkg)
			allowMissingPkg=true;

		if (!this.loaded)
			await this.load({allowMissingPkg});

		if (!this.eventCommands[command])
			throw new DeclaredError("Unknown command: "+command);

		if (options.mode) {
			if (this.mode && options.mode!=this.mode)
				throw new Error("Can't change mode");

			this.mode=options.mode;
		}

		if (!this.mode)
			this.mode=this.eventCommands[command].commandDefaultMode;

		if (!this.mode)
			this.mode="dev";

		if (!["dev","prod"].includes(this.mode))
			throw new Error("Unknown mode: "+this.mode);

		if (!this.env)
			await this.populateEnv();

		let event=new AsyncEvent(command,options);
		return await this.dispatchEvent(event);
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