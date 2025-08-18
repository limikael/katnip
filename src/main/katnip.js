#!/usr/bin/env node

import path from "node:path";
import {fileURLToPath} from 'node:url';
import {getPackageVersion, getEffectiveCwd} from "../utils/node-util.js";
import {parseEarlyOptions} from "../utils/commander-util.js";
import KatnipProject from "./KatnipProject.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
	let earlyProgram=parseEarlyOptions(["--cwd <cwd>","--platform <platform>","--help","--version"]);
	let {cwd, platform}=earlyProgram.opts();

	if (!cwd)
		cwd=process.cwd();

	if (earlyProgram.args[0] && earlyProgram.args[0]!="init")
		cwd=await getEffectiveCwd(cwd);

	// Redirect `--help <cmd>` to `<cmd> --help
	const rawArgs = process.argv.slice(2);
	if (rawArgs[0] === '--help' && rawArgs[1]) {
		const helpTarget = rawArgs[1];
		process.argv = [process.argv[0], process.argv[1], helpTarget, '--help'];
	}

	let project=new KatnipProject({cwd, platform});
	let program=project.program;
	program
		.option("--version","Print version.")
		.action(async options=>{
			if (program.args.length)
				console.log("Unknown command: "+program.args[0]);

			else if (options.version)
				console.log(await getPackageVersion(__dirname));

			else
				program.outputHelp();
		});

	if (earlyProgram.args[0]!="init") {
		if (!earlyProgram.args[0])
			await project.load({allowMissingPkg: true});

		else
			await project.load();
	}

	await project.program.parseAsync();
}

catch (e) {
	if (!e.declared)
		throw e;

	console.log("Error: "+e.message);
	process.exit(1);
}
