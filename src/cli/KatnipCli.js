import * as cliPlugin from "./katnip-cli-project.js";
import HookRunner from "../hooks/HookRunner.js";
import ProjectHookRunner from "../hooks/ProjectHookRunner.js";
import HookEvent from "../hooks/HookEvent.js";
import InitCliEvent from "./InitCliEvent.js";
import {parseCommand} from "../utils/commander-util.js";
import {resolveHookEntryPoints} from "../utils/npm-util.js";
import path from "path";
import fs from "fs";
import {Command} from "commander";
import JSON5 from "json5";
import {fileURLToPath} from 'url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));

export default class KatnipCli extends ProjectHookRunner {
	constructor({argv, cwd}) {
		super();

		this.argv=argv;
		this._cwd=cwd;
	}

	cwd() {
		return this._cwd;
	}

	async run() {
		let katnipPkgFn=path.join(__dirname,"../../package.json");
		let katnipPkg=JSON.parse(fs.readFileSync(katnipPkgFn));

		//this.hookRunner=new HookRunner();
		this.addListenerModule(cliPlugin);

		if (fs.existsSync(path.join(this.cwd(),"package.json"))) {
			this.projectMode=true;

			let entryPoints=await resolveHookEntryPoints({
				cwd: this.cwd(),
				keyword: "katnip-plugin",
				importPath: "katnip-project-hooks",
				conditions: ["node"],
				fs
			});

			for (let ep of entryPoints)
				this.addListenerModule(await import(ep));
		}

		this.program=new Command();
		this.program.name("katnip");
		this.program.version(katnipPkg.version);

		let desc="Zero Conf Javascript Full Stack Plugin System.\n\n";
		if (this.projectMode)
			desc+="Project: "+this.cwd();

		else
			desc+="(Running outside project, command set is limited)";

		this.program.description(desc);

		let initCliEvent=new InitCliEvent(this);
		await this.dispatch(initCliEvent);

		this.command=parseCommand(initCliEvent.program,this.argv);
		this.commandEvent=this.createCommandEvent();
		await this.dispatch(this.commandEvent);

		//console.log("exit run");
	}

	createCommandEvent() {
		let options=this.getOptions();

		let ev=new HookEvent(this.command._name,{
			tags: [this.command._name,options.platform],
			options: options,
			katnipCli: this,
			cwd: this.cwd(),
			fs: fs
		});

		return ev;
	}

	readOptionsFile(fn) {
		let fullFn=path.join(this.cwd(),fn);
		if (!fs.existsSync(fullFn))
			return {};

		return JSON5.parse(fs.readFileSync(fullFn));
	}

	getOptions() {
		let options={};

		options={...options,...this.readOptionsFile("katnip.json")};
		options={...options,...this.readOptionsFile("katnip.local.json")};

		let programOptions=this.program.opts();
		for (let k in programOptions) {
			if (!options.hasOwnProperty(k) || 
					this.program.getOptionValueSource(k)!="default")
				options[k]=programOptions[k];
		}

		let commandOptions=this.command.opts();
		for (let k in commandOptions) {
			if (!options.hasOwnProperty(k) || 
					this.command.getOptionValueSource(k)!="default")
				options[k]=commandOptions[k];
		}

		return options;
	}

	async stop() {
		let stopEvent=new HookEvent("stop",this.commandEvent);
		await this.dispatch(stopEvent);
	}

	isProjectMode() {
		return this.projectMode;
	}
}