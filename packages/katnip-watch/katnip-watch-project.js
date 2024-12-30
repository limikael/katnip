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

	if (!devEvent.watcher) {
		console.log("Watching with: "+devEvent.options.watch);

		let target=devEvent.target;

		let ignore=[
			"node_modules/**",
			"public/**",
			"upload/**"
		];

		await devEvent.target.dispatch(new HookEvent("watchIgnore",{
			watchIgnore: ignore,
			...devEvent
		}));

		let watcherOptions={
			ignore: ignore,
			fs,
			method: devEvent.options.watch
		};

		devEvent.watcher=createWatch(process.cwd(),watcherOptions);
		let watchPromise=awaitEvent(devEvent.watcher,"change");

		while (1) {
			await target.dispatch(devEvent);

			let ev=await watchPromise;
			console.log("file change: "+ev.filename);
			watchPromise=awaitEvent(devEvent.watcher,"change");

			await target.dispatch(new HookEvent("stop",devEvent));
		}
	}
}
