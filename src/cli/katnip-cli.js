#!/usr/bin/env node

import path from "path";
import {fileURLToPath} from 'url';
import minimist from "minimist";
import HookRunner from "../hooks/HookRunner.js";
import HookEvent from "../hooks/HookEvent.js";
import {findKatnipModules} from "./find-katnip-modules.js";
import CliSpec from "./CliSpec.js";
import fs from "fs";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

class CliRunner {
	async load() {
		this.hookRunner=new HookRunner();
		for (let fn of findKatnipModules("cli",{reqConditions: "cli"}))
			this.hookRunner.addListenerModule(await import(fn));

		this.cliSpec=new CliSpec();
		this.cliSpec.addGlobalOption("help","Get help for specified command.",{type: "boolean"});

		await this.hookRunner.emit("initcli",this.cliSpec);
	}

	parseCommandLine(inputArgv) {
		let boolean=this.cliSpec.getBooleanOptions();
		let argv=minimist(inputArgv,{
			boolean: boolean,
		});

		for (let k of Object.keys(argv))
			if (boolean.includes(k) &&
					!inputArgv.includes("--"+k) &&
					!inputArgv.includes("--no-"+k) &&
					inputArgv.filter(p=>p.startsWith(`--${k}=`)).length==0)
				delete argv[k];

		return this.parseArgv(argv);
	}

	parseArgv(argv) {
		argv=this.cliSpec.parseArgv(argv);
		if (!argv)
			process.exit();

		let katnipJsonFn=path.join(process.cwd(),"katnip.json");
		if (fs.existsSync(katnipJsonFn))
			argv={
				...JSON.parse(fs.readFileSync(katnipJsonFn,"utf8")),
				...argv
			};

		this.cliSpec.populateDefault(argv);
		return argv;
	}

	createEvent(argv) {
		let {_, ...options}=argv;
		return new HookEvent(_[0],{options: options});
	}
}

try {
	let cliRunner=new CliRunner();
	await cliRunner.load();
	let argv=cliRunner.parseCommandLine(process.argv.slice(2));

	let command=cliRunner.cliSpec.getCommandByName(argv._[0]);
	let preCommand=command.getPreCommand(argv);
	if (preCommand) {
		preCommand=cliRunner.parseArgv(preCommand);
		let preEv=cliRunner.createEvent(preCommand);
		await cliRunner.hookRunner.emit(preEv);

		await cliRunner.load();
		argv=cliRunner.parseCommandLine(process.argv.slice(2));
	}

	let mainEv=cliRunner.createEvent(argv);
	await cliRunner.hookRunner.emit(mainEv);
}

catch (e) {
	if (e.declared) {
		console.log();
		console.log("**** ERROR ****");
		console.log(e.message);
		console.log();
	}

	else {
		console.log(e);
	}
}