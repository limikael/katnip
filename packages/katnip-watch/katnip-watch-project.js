import path from "path";
import {fileURLToPath} from 'url';
import fs from "fs";
import chokidar from "chokidar";
import {ResolvablePromise} from "katnip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function arrayify(a) {
	if (Array.isArray(a))
		return a;

	if (a===undefined)
		return [];

	return [a];
}

export async function initcli(spec) {
    spec.addCommandOption("dev","watch",{
        description: "Watch files and restart server.",
        type: "boolean",
	    default: true
    });
}

dev.priority=5;
export async function dev(devEvent) {
	if (devEvent.options.watch===false) {
		console.log("Skipping watch...");
		return;
	}

	devEvent.stopPropagation();

	let watchDirs=[process.cwd()];
	let ignored=[
		"**/node_modules/**", "**/.git/**", "**/*.db*",
		"**/.env", "**/package.json", "**/package-lock.json", "**/yarn.lock",
		"**/katnip-cli.js","**/public","**/.target","**/.wrangler",
		"**/wrangler.toml","**/upload"
	];

	if (devEvent.options.watchAddIgnore) {
		let addIgnore=arrayify(devEvent.options.watchAddIgnore);
		console.log("Adding watch ignore: "+JSON.stringify(addIgnore));

		ignored=[...ignored,...addIgnore];
	}

	let watcher=chokidar.watch(watchDirs,{
		ignored: ignored,
	});

	let startPromise=new ResolvablePromise();
	let	changePromise=new ResolvablePromise();

	watcher.on("ready",(ev, p)=>{
		watcher.on("all",(ev, p)=>{
			console.log("File change: "+ev+" "+p);
			changePromise.resolve();
		});

		startPromise.resolve();
	});

	await startPromise;

	console.log("Watching for changes...");

	while (true) {
		let job;

		try {
			job=await devEvent.runRemaining();
		}

		catch (e) {
			console.log("Failed to start");
			console.log(e);
		}

		console.log("Watching for code changes...");
		await changePromise;
		console.log();
		console.log("Change detected...");
		changePromise=new ResolvablePromise();

		if (job && job.stop) {
			console.log("Stopping current job...");
			await job.stop();
		}

		else {
			console.log("Job can't be stopped.");
		}
	}
}
