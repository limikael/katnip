import {AsyncEvent} from "../../src/utils/async-events.js";
import {startFileWatcher} from "../../src/utils/file-watcher.js";
import path from "node:path";

export function initCli(ev) {
	ev.target.eventCommand("dev")
		.option("--no-watch","Don't watch files for changes.");
}

dev.priority=1;
export async function dev(devEvent) {
	let project=devEvent.target;

	if (devEvent.watch) {
		let watchPaths=project.env.config.watchPaths;
		if (!watchPaths)
			watchPaths=["src"];

		watchPaths=watchPaths.map(p=>path.join(project.cwd,p));
		project.log("Watching...");

		let watcher=startFileWatcher({
			directories: watchPaths
		});

		while (true) {
			let watchedDevEvent=new AsyncEvent("dev",{...devEvent, watch: false});
			let devServer;
			try {
				devServer=await project.dispatchEvent(watchedDevEvent);
			}

			catch (e) {
				if (!e.message.includes("Build failed") ||
						!e.errors)
					console.log(e);
			}

			await watcher.wait();
			project.log("File change...");

			if (devServer)
				await devServer.stop();
		}
	}
}