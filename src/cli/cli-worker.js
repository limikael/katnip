import HookRunner from "../hooks/HookRunner.js";
import HookEvent from "../hooks/HookEvent.js";
import {findKatnipModules} from "./find-katnip-modules.js";
import CliSpec from "./CliSpec.js";
import minimist from "minimist";
import {workerData, parentPort} from "worker_threads";
import path from "path";
import fs from "fs";

class CliRunner {
	async load() {
		this.hookRunner=new HookRunner();
		for (let fn of findKatnipModules("cli",{reqConditions: "cli"}))
			this.hookRunner.addListenerModule(await import(fn));

		this.cliSpec=new CliSpec();
		this.cliSpec.addGlobalOption("help","Get help for specified command.",{type: "boolean"});
		this.cliSpec.addGlobalOption("version","Print version.",{type: "boolean"});

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
			return;
//			process.exit();

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
	let argv=cliRunner.parseCommandLine(workerData.argv);
	if (argv) {
		let mainEv=cliRunner.createEvent(argv);
		let result=await cliRunner.hookRunner.emit(mainEv);
		if (Object(result)!==result) {
			parentPort.postMessage(result);
		}
	}
}

catch (e) {
	parentPort.postMessage({
		type: "error",
		message: e.message,
		declared: e.declared
	});
	process.exit(1);
}
