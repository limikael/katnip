import HookRunner from "../hooks/HookRunner.js";
import HookEvent from "../hooks/HookEvent.js";
import BuildEvent from "../hooks/BuildEvent.js";
import fs from "fs";
import {DeclaredError, ResolvablePromise, Job} from "../utils/js-util.js";
import path from "path";
import {Worker} from "worker_threads";
import {fileURLToPath} from 'url';
import {runCommand, workerPortRequest} from "../utils/node-util.js";
import {projectNeedInstall} from "../utils/npm-util.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

export async function create(ev) {
	if (!ev.options.name)
		throw new DeclaredError("Need project name.");

	if (fs.existsSync(ev.options.name))
		throw new DeclaredError("Already exists: "+ev.options.name);

	fs.mkdirSync(ev.options.name);
	process.chdir(ev.options.name);
	let projectPath=process.cwd();

	try {
	    let templateDep=ev.options.template;
	    if (!templateDep)
	    	templateDep="katnip-twentytwentyfour";

	    let pkgResponse=await fetch("https://registry.npmjs.org/"+templateDep+"/latest");
	    if (pkgResponse.status<200 || pkgResponse.status>=300)
	        throw new DeclaredError("Error loading template: "+await pkgResponse.text());

	    let pkgResult=await pkgResponse.json();
	    if (!pkgResult.keywords ||
		    	!pkgResult.keywords.includes("katnip-template"))
	    	throw new DeclaredError("Not a katnip template: "+templateDep);

	    console.log("Using template: "+templateDep+" "+pkgResult.version);

	    let projectName=path.basename(process.cwd());
	    console.log("Creating package.json for: "+projectName);
	    let packageJson={
	        name: projectName,
	        license: "UNLICENSED",
	        private: true,
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

		console.log("Creating .gitignore");
	    fs.writeFileSync(".gitignore",GIT_IGNORE);

	    switch (ev.options.install) {
		    case "yarn":
		    	console.log("Installing with yarn...");
		    	await runCommand("yarn",["install"],{stdio: "inherit"});
		    	break;

		    case "npm":
		    	console.log("Installing with npm...");
		    	await runCommand("npm",["install"],{stdio: "inherit"});
		    	break;

		    case "none":
		    	console.log("Skipping installation.");
		    	break;

		    default:
		    	throw new DeclaredError("Unknown install option: "+ev.options.install);
		    	break;
	    }

	    if (ev.options.install!="none") {
	    	console.log("Project created and installed! Start with:");
	    	console.log();
	    	console.log("  cd "+projectName);
	    	console.log("  "+ev.options.install+" start");
	    	console.log();
	    }
	}

	catch (e) {
		if (fs.existsSync(projectPath)) {
			if (fs.readdirSync(projectPath).length==0)
				fs.rmdirSync(projectPath);
		}

		throw e;
	}
}

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
	if (!fs.existsSync("package.json"))
		throw new DeclaredError(
			"This is not a katnip project, package.json doesn't exist. "+
			" You can create a new project with 'katnip create'."
		);

	if (ev.options.checkInstall) {
		if (await projectNeedInstall(process.cwd(),{fs})) {
			throw new DeclaredError("Project install is not up-to-date.");
		}

		else {
			console.log("Project is up-to-date.");
		}
	}

	ev.cwd=process.cwd();
	ev.fs=fs;
}

initcli.priority=5;
export async function initcli(spec) {
	spec.addCommand("build","Build project.",{
		cli: false
	});

	spec.addCommand("dev","Start development server.",{
		inheritOptions: "build"
	});

	spec.addCommandOption("dev","port",{
		description: "Port to listen to.",
		default: 3000
	});
	spec.addCommandOption("dev","init",{
		description: "Run init if needed.",
		type: "boolean",
		default: true
	});
	spec.addCommandOption("dev","checkInstall",{
		description: "Check installation dependencies.",
		type: "boolean",
		default: true
	});

	spec.addCommand("init","Initialize plugins.");
	spec.addCommandOption("init","checkInstall",{
		description: "Install installation dependencies.",
		type: "boolean",
		default: true
	});

	spec.addCommand("create","Create a new project.",{
		projectMode: false
	});
	spec.addCommandOption("create","name",{
		description: "Name of project to create. Required.",
		positional: true,
	});
	spec.addCommandOption("create","template",{
		description: "Template to set as dependency."
	});
	spec.addCommandOption("create","install",{
		description: "Package manager to use, one of npm, yarn or none.",
		default: "npm"
	});
}

export async function registerHooks(hookRunner) {
	hookRunner.on("dev",predev);
	hookRunner.on("dev",postdev);
}

predev.priority=1;
async function predev(ev) {
	if (ev.options.init) {
		let initEvent=new HookEvent("init",{options: {
			...ev.options,
			createPackage: false,
		}});

		await ev.hookRunner.emit(initEvent);
	}

	if (!fs.existsSync("package.json"))
		throw new DeclaredError(
			"This is not a katnip project, package.json doesn't exist. "+
			" You can create a new project with 'katnip create'."
		);
}

export async function dev(ev) {
	let buildEvent=new BuildEvent({
		options: ev.options,
		platform: "node",
		cwd: process.cwd(),
		fs: fs
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
	let currentPromise;

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

	worker.on("error",(e)=>{
		worker.terminate();
		currentPromise.reject(e);
	});

	currentPromise=startedPromise;
	await startedPromise;

	return new Job(async ()=>{
		console.log("Stopping worker...");
		currentPromise=startedPromise;
		worker.postMessage("stop");
		await stoppedPromise;
	});
}