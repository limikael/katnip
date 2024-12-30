#!/usr/bin/env node
import KatnipCli from "./KatnipCli.js";

let katnipCli=new KatnipCli({
	cwd: process.cwd(),
	argv: process.argv,
});

try {
	await katnipCli.run();	
}

catch (e) {
	if (e.declared) {
		console.error("");
		console.error("    **  ");
		console.error("    **  Error: "+e.message);
		console.error("    **  ");
		console.error("");
	}

	else {
		throw e;
	}
}