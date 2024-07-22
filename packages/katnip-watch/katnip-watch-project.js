import path from "path";
import {fileURLToPath} from 'url';
import fs from "fs";
import chokidar from "chokidar";
import {ResolvablePromise} from "katnip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dev.priority=5;
export async function dev(devEvent) {
	devEvent.stopPropagation();

	let watchDirs=[process.cwd()];
	let ignored=[
		"**/node_modules/**", "**/.git/**", "**/*.db*",
		"**/.env", "**/package.json", "**/package-lock.json", "**/yarn.lock",
		"**/katnip-cli.js","**/public","**/.target","**/.wrangler",
		"**/wrangler.toml","**/upload"
	];

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
