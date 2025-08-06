import {AsyncEvent} from "../../src/utils/async-events.js";
import {startFileWatcher} from "../../src/utils/file-watcher.js";
import {promiseAnyIndex} from "../../src/utils/js-util.js";
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
						!e.errors) {
					if (e.declared)
						console.log("Error: "+e.message);
			
					else
						console.log(e);
				}
			}

			if (!devServer)
				devEvent.target.log("No dev server started...");

			await watcher.wait();
			project.log("File change...");

			if (devServer)
				await devServer.stop();

			/*if (!devServer) {
				devEvent.target.log("No dev server started...");
				process.exit(1);
			}

			let promises=[watcher.wait()];
			if (devServer.wait)
				promises.push(devServer.wait());

			let i=await promiseAnyIndex(promises);
			if (i>=1) {
				devEvent.target.log("Dev server exited...");
				process.exit();
			}

			project.log("File change...");
			await devServer.stop();*/
		}
	}
}