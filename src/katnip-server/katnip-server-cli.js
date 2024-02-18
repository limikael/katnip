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

let GIT_IGNORE=
`node_modules
.target
.wrangler
public/*.css
public/*.js
upload
*.db
`;

init.priority=5;
export async function init(ev) {
	if (!fs.existsSync("package.json")) {
	    let templateDep=ev.options.template;
	    let pkgResponse=await fetch("https://registry.npmjs.org/"+templateDep+"/latest");
	    if (pkgResponse.status<200 || pkgResponse>=300)
	        throw new Error(await pkgResponse.text());

	    let pkgResult=await pkgResponse.json();
	    if (!pkgResult.keywords.includes("katnip-template"))
	    	throw new DeclaredError("Not a katnip template: "+templateDep);

	    console.log("Using template: "+templateDep+" "+pkgResult.version);

	    let projectName=path.basename(process.cwd());
	    console.log("Creating package.json for: "+projectName);
	    let packageJson={
	        name: projectName,
	        license: "UNLICENSED",
	        private: "true",
	        scripts: {
	        	"start": "katnip dev",
	        	"dev": "katnip dev",
	        	"postinstall": "katnip init"
	        },
	        type: "module",
	        version: "1.0.0",
	        dependencies: {}
	    };

	    packageJson.dependencies[templateDep]="^"+pkgResult.version;
	    fs.writeFileSync("package.json",JSON.stringify(packageJson,null,2));
	}

	if (!fs.existsSync(".gitignore")) {
		console.log("Creating .gitignore");
	    fs.writeFileSync(".gitignore",GIT_IGNORE);
	}
}

export async function initcli(spec) {
	spec.addCommand("dev","Start development server.");
	spec.addCommandOption("dev","port",{
		description: "Port to listen to.",
		default: 3000
	});

	spec.addCommand("init","Initialize plugins.");
	spec.addCommandOption("init","template",{
		description: "Template to set as dependency.",
		default: "katnip-twentytwentyfour"
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