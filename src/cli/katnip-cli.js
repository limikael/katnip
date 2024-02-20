#!/usr/bin/env node

import path from "path";
import {fileURLToPath} from 'url';
import {runWorker} from "../utils/node-util.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

try {
	let result;
	do {
		let workerPath=path.join(__dirname,"cli-worker.js");
		result=await runWorker(workerPath,{
			workerData: {
				argv: process.argv.slice(2)
			}
		});
	} while (result=="restart");
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