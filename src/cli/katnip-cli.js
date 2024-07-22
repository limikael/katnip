#!/usr/bin/env node

/*import path from "path";
import {fileURLToPath} from 'url';*/
import {runCli} from "./cli-worker.js";
import semver from "semver";

//const __dirname=path.dirname(fileURLToPath(import.meta.url));

try {
	let requiredVersion=">=20.0.0";
	if (!semver.satisfies(process.version,requiredVersion))
		throw new DeclaredError(
			"Your Node.js version is too old, you are using "+process.version+
			" you need "+requiredVersion+".");

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