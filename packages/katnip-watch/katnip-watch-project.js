import fs from "fs";
import {HookEvent} from "katnip";
import {createWatch, awaitEvent} from "./fs-util.js";
import {Option} from "commander";

initCli.priority=15;
export async function initCli(initCliEvent) {
	let devCommand=initCliEvent.getCommandSpec("dev");
	devCommand.addOption(
		new Option("--watch <method>","How to watch for file change.")
			.default("chokidar")
			.choices(["fs","chokidar","none"])
	);
}

dev.priority=1;
export async function dev(devEvent) {
	if (devEvent.options.watch=="none")
		return;

	let target=devEvent.target;

	if (!target.watcher) {
		console.log("Watching with: "+devEvent.options.watch);

		let ignore=[
			"node_modules/**",
			"public/**",
			"upload/**"
		];

		await target.dispatch(new HookEvent("watchIgnore",{
			watchIgnore: ignore,
			...devEvent
		}));

		let watcherOptions={
			ignore: ignore,
			fs,
			method: devEvent.options.watch
		};

		target.watcher=createWatch(process.cwd(),watcherOptions);
		let watchPromise=awaitEvent(target.watcher,"change");

		while (1) {
			devEvent.options=target.getOptions();
			try {
				await target.dispatch(devEvent);
			}

			catch (e) {
				console.log("** Error while watching, waiting for file change to rebuild...");
				console.log(e);
			}

			let ev=await watchPromise;
			console.log("file change: "+ev.filename);
			watchPromise=awaitEvent(target.watcher,"change");

			//console.log("stopping...");
			await target.dispatch(new HookEvent("stop",devEvent));
			//console.log("stopped");
		}
	}
}
