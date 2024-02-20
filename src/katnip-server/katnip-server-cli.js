import HookRunner from "../hooks/HookRunner.js";
import HookEvent from "../hooks/HookEvent.js";
import {findKatnipModules} from "../cli/find-katnip-modules.js";
import BuildEvent from "../hooks/BuildEvent.js";
import fs from "fs";
import {DeclaredError, ResolvablePromise, Job} from "../utils/js-util.js";
import path from "path";
import {Worker} from "worker_threads";
import {fileURLToPath} from 'url';
import {projectNeedInstall, runCommand, workerPortRequest} from "../utils/node-util.js";
import semver from "semver";
import {parentPort} from "worker_threads";
const __dirname=path.dirname(fileURLToPath(import.meta.url));

export async function create(ev) {
	if (!ev.options.name)
		throw new DeclaredError("Need project name.");

	if (fs.existsSync(ev.options.name))
		throw new DeclaredError("Already exists: "+ev.options.name);

	fs.mkdirSync(ev.options.name);
	let projectPath=path.resolve(ev.options.name);

	if (parentPort)
		await workerPortRequest(parentPort,{
			type: "chdir",
			chdir: ev.options.name
		});

	else
		process.chdir(ev.options.name);

	try {
		await ev.hookRunner.emit(new HookEvent("init",{options: {
			createPackage: true,
			install: ev.options.install,
			template: ev.options.template
		}}));
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
	let requiredVersion=">=20.0.0";
	if (!semver.satisfies(process.version,requiredVersion))
		throw new DeclaredError(
			"Your Node.js version is too old, you are using "+process.version+
			" you need "+requiredVersion+".");

	if (!ev.options.createPackage &&
			!fs.existsSync("package.json"))
		throw new DeclaredError(
			"This is not a katnip project, package.json doesn't exist. "+
			" You can create a new project with 'katnip create'."
		);

	if (fs.existsSync("package.json") && ev.options.template)
		throw new DeclaredError("Can not set template, package.json already exists.");

	if (!fs.existsSync("package.json")) {
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
	}

	if (!fs.existsSync(".gitignore")) {
		console.log("Creating .gitignore");
	    fs.writeFileSync(".gitignore",GIT_IGNORE);
	}

	if (ev.options.install) {
		if (projectNeedInstall(process.cwd())) {
			console.log("Installing fresh dependencies...");
			await runCommand("npm",["install"],{
				stdio: "inherit"
			});
			return "restart";
		}

		else {
			console.log("Project is up-to-date.");
		}
	}
}

export async function initcli(spec) {
	spec.addCommand("dev","Start development server.");

	spec.addCommandOption("dev","port",{
		description: "Port to listen to.",
		default: 3000
	});
	spec.addCommandOption("dev","init",{
		description: "Run init if needed.",
		type: "boolean",
		default: true
	});
	spec.addCommandOption("dev","install",{
		description: "Install dependencies if needed.",
		type: "boolean",
		default: true
	});

	spec.addCommand("init","Initialize plugins.");
	spec.addCommandOption("init","createPackage",{
		description: "Create package.json if it doesn't exist.",
		type: "boolean",
		default: true
	});
	spec.addCommandOption("init","template",{
		description: "Template to set as dependency."
	});
	spec.addCommandOption("init","install",{
		description: "Install dependencies on initialization.",
		type: "boolean",
		default: true
	});

	spec.addCommand("create","Create a new project.");
	spec.addCommandOption("create","name",{
		description: "Name of project to create. Required.",
		positional: true,
	});
	spec.addCommandOption("create","template",{
		description: "Template to set as dependency."
	});
	spec.addCommandOption("create","install",{
		description: "Install dependencies.",
		type: "boolean",
		default: true
	});
}

export async function registerHooks(hookRunner) {
	//hookRunner.on("init",postinit);
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

		let result=await ev.hookRunner.emit(initEvent);
		if (result=="restart") {
			console.log("Restarting after init event...");
			return "restart";
		}
		/*if (initEvent.didInstall) {
		}*/
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