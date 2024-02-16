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

let hookRunner=new HookRunner();
for (let fn of findKatnipModules("cli",{reqConditions: "cli"})) {
	//console.log(fn);
	hookRunner.addListenerModule(await import(fn));
}

let cliSpec=new CliSpec();
cliSpec.addGlobalOption("help","Get help for specified command.",{type: "boolean"});

await hookRunner.emit("initcli",cliSpec);
let argv=minimist(process.argv.slice(2),{
	boolean: cliSpec.getBooleanArgs()
});

if (!cliSpec.checkArgv(argv))
	process.exit();

let katnipJsonFn=path.join(process.cwd(),"katnip.json");
if (fs.existsSync(katnipJsonFn))
	argv={
		...JSON.parse(fs.readFileSync(katnipJsonFn,"utf8")),
		...argv
	};

cliSpec.populateDefault(argv);
let cliMainEv=new HookEvent(argv._[0],{options: argv});

try {
	await hookRunner.emit(cliMainEv);
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