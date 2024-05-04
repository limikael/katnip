#!/usr/bin/env node

import path from "path";
import {fileURLToPath} from 'url';
import {runCli} from "./cli-worker.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

try {
	let result=await runCli(process.argv.slice(2));
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