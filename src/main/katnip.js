#!/usr/bin/env node

import {program, Option} from "commander";
import path from "node:path";
import {fileURLToPath} from 'node:url';
import {getPackageVersion} from "../utils/node-util.js";
import {withProgramOptions} from "../utils/commander-util.js"
import {katnipServe, katnipBuild, katnipInit, katnipProvision} from "./katnip-commands.js";
import {mikrokatGetTargets} from "mikrokat";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

program.name("katnip")
	.description("Full stack edge framework.")
	.passThroughOptions()
	.option("--cwd <cwd>","Run as if started from this dir.",process.cwd())
	.option("--silent","Suppress output.")
	.option("--version","Print version.")
	.action(async options=>{
		if (options.version)
			console.log(await getPackageVersion(__dirname));

		else
			program.outputHelp();
	});

program.command("serve")
	.alias("dev")
	.description("Serve from this machine.")
	.addOption(new Option("--port <port>","Listening port.").default(3000).env("PORT"))
	.action(withProgramOptions(program,katnipServe));

program.command("build")
	.description("Build project.")
	.addOption(new Option("--target <provider>","Provider to build for."))
	.action(withProgramOptions(program,katnipBuild));

program.command("provision")
	.description("Provision project services.")
	.addOption(new Option("--target <provider>","Provider to provision for."))
	.option("--local","Provision local (dev) services.")
	.option("--remote","Provision remote services.")
	.action(withProgramOptions(program,katnipProvision));

program.command("init")
	.description("Initialize project and/or target.")
	.addOption(new Option("--target <provider>","Provider to initialize.").choices(mikrokatGetTargets())/*.env("TARGET")*/)
	.action(withProgramOptions(program,katnipInit));

try {
	await program.parseAsync();
}

catch (e) {
	if (!e.declared)
		throw e;

	console.log("Error: "+e.message);
}