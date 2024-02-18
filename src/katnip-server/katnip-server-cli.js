import HookRunner from "../hooks/HookRunner.js";
import HookEvent from "../hooks/HookEvent.js";
import {findKatnipModules} from "../cli/find-katnip-modules.js";
import BuildEvent from "../hooks/BuildEvent.js";
import fs from "fs";
import {DeclaredError, ResolvablePromise, Job} from "../utils/js-util.js";
import path from "path";
import {Worker} from "worker_threads";
import {fileURLToPath} from 'url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));

export async function initcli(spec) {
	spec.addCommand("dev","Start development server.");
	spec.addCommandOption("dev","port",{
		description: "Port to listen to.",
		default: 3000
	});
}

export async function registerHooks(hookRunner) {
	hookRunner.on("dev",predev);
	hookRunner.on("dev",postdev);
}

predev.priority=1;
async function predev(ev) {
	let pkgPath=path.join(process.cwd(),"package.json");
	if (!fs.existsSync(pkgPath))
		throw new DeclaredError(
			"This is not a katnip project, this file doesn't exist: "+pkgPath+
			" You can create a new project with 'katnip create'."
		);
}

export async function dev(ev) {
	let buildEvent=new BuildEvent({
		options: ev.options,
		platform: "node"
	});

	await ev.hookRunner.emit(buildEvent);

	ev.data=buildEvent.data;
	ev.importModules=buildEvent.importModules;
}

postdev.priority=20;
async function postdev(ev) {
	let workerData={
		options: ev.options,
		importModules: ev.importModules,
		data: ev.data
	};

	let startedPromise=new ResolvablePromise();
	let stoppedPromise=new ResolvablePromise();
	let worker=new Worker(path.join(__dirname,"worker.js"),{
		workerData: workerData
	});
	worker.on("message",(message)=>{
		switch (message) {
			case "started":
				startedPromise.resolve();
				break;

			case "stopped":
				worker.terminate();
				stoppedPromise.resolve();
				break;

			default:
				console.log("?? Got message from worker: "+message);
				break;
		}
	});

	await startedPromise;
	//console.log("Worker started...");

	return new Job(async ()=>{
		//console.log("Stopping worker...");
		worker.postMessage("stop");
		await stoppedPromise;
	});
}