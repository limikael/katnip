import {importWorker} from "../utils/import-worker.js";
import path from "path";
import {fileURLToPath} from 'url';
import HookEvent from "../hooks/HookEvent.js";
import fs from "fs";
import {Option} from "commander";
import {table} from "table";
import {DeclaredError} from "../utils/js-util.js";
import {runCommand} from "../utils/node-util.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

initCli.priority=5;
export async function initCli(ev) {
	let c,o;

	if (ev.katnipCli.isProjectMode()) {
		c=ev.program.command("dev")
		c.description("Start dev server.");
		c.option("--port <port>","Port to listen to.",3000);
		o=new Option("--platform <platform>","Platform to build for.");
		o.choices(["node"]);
		o.default("node");
		c.addOption(o);

		c=ev.program.command("init");
		c.description("Init plugins.");

		c=ev.program.command("deploy")
		c.description("Deploy project.");
		o=new Option("--platform <platform>","Platform to deploy to.");
		o.makeOptionMandatory();
		o.choices([]);
		c.addOption(o);

		c=ev.program.command("undeploy")
		c.description("Undeploy project.");
		o=new Option("--platform <platform>","Platform to undeploy from.");
		o.makeOptionMandatory();
		o.choices([]);
		c.addOption(o);
	}

	if (!ev.katnipCli.isProjectMode()) {
		c=ev.program.command("create <name>");
		c.description("Create new project.");
		c.option("--meta <name>","Meta plugin to use. Use 'katnip lsmeta' to list available.");
		o=new Option("--install <installer>","How to install project.");
		o.choices(["npm","yarn","none"]);
		o.default("npm");
		c.addOption(o);

		c=ev.program.command("lsmeta");
		c.description("List available meta plugins.");
	}
}

export async function create(ev) {
	let projectName=ev.katnipCli.command.args[0];
	console.log("Creating project: ",projectName);

	let projectDir=path.join(process.cwd(),projectName);
	if (fs.existsSync(projectDir))
		throw new DeclaredError("Already exists: "+projectDir);

	fs.mkdirSync(projectDir);
	ev.cwd=projectDir;

	try {
	    let metaDep=ev.options.meta;
	    if (!metaDep)
	    	//metaDep="katnip-twentytwentyfour";
	    	metaDep="katnip-isoq";

	    let pkgResponse=await fetch("https://registry.npmjs.org/"+metaDep+"/latest");
	    if (pkgResponse.status<200 || pkgResponse.status>=300)
	        throw new DeclaredError("Error loading package: "+await pkgResponse.text());

	    let pkgResult=await pkgResponse.json();
	    if (!pkgResult.keywords ||
		    	!pkgResult.keywords.includes("katnip-meta"))
	    	throw new DeclaredError("Not a katnip meta package: "+metaDep);

	    console.log("Using meta: "+metaDep+" "+pkgResult.version);

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

	    packageJson.dependencies[metaDep]="^"+pkgResult.version;
	    fs.writeFileSync(path.join(projectDir,"package.json"),JSON.stringify(packageJson,null,2));

		//console.log("Creating .gitignore");
	    //fs.writeFileSync(".gitignore",GIT_IGNORE);

	    let devCommand="";
	    switch (ev.options.install) {
		    case "yarn":
		    	console.log("Installing with yarn...");
		    	devCommand="yarn dev";
		    	await runCommand("yarn",["--cwd",projectDir,"install"],{stdio: "inherit"});
		    	break;

		    case "npm":
		    	console.log("Installing with npm...");
		    	devCommand="npm run dev";
		    	await runCommand("npm",["install","--prefix",projectDir],{stdio: "inherit"});
		    	break;

		    case "none":
		    	console.log("Skipping installation.");
		    	break;

		    default:
		    	throw new DeclaredError("Unknown install option: "+ev.options.install);
		    	break;
	    }

	    if (ev.options.install!="none") {
	    	console.log("Project created and installed! Start with dev server:");
	    	console.log();
	    	console.log("  cd "+projectName);
	    	console.log("  "+devCommand);
	    	console.log();
	    }
	}

	catch (e) {
		if (fs.existsSync(projectDir)) {
			if (fs.readdirSync(projectDir).length==0)
				fs.rmdirSync(projectDir);
		}

		throw e;
	}
}

export async function lsmeta(ev) {
	let url=new URL("https://registry.npmjs.com/-/v1/search?size=20");
	url.searchParams.set("text","keywords:katnip-meta");
	let response=await fetch(url);
    if (response.status<200 || response.status>=300)
        throw new DeclaredError("Error listing plugins: "+await pkgResponse.text());

	let result=await response.json();
	let tableData=[];

	for (let pkg of result.objects) {
		let desc="(no description)";
		if (pkg.package.description)
			desc=pkg.package.description;

		tableData.push([pkg.package.name,desc])
	}

	let tableConfig = {
		columns: [
			{width: 26},
			{width: 47},
		],
		header: {
			alignment: 'center',
			content: "AVAILABLE META PLUGINS\nUse with 'katnip create --meta=<metaplugin>'",
		}
	};

	console.log(table(tableData,tableConfig));
}

devBuild.event="dev";
devBuild.priority=5;
export async function devBuild(devEvent) {
	devEvent.options=devEvent.katnipCli.getOptions();
	devEvent.tags=["dev",devEvent.options.platform];

	let buildEvent=new HookEvent("build",{
		importModules: {},
		appData: {},
		fs: fs,
		cwd: devEvent.cwd,
		options: devEvent.options,
		tags: devEvent.tags
	});

	let start=Date.now();
	await devEvent.target.dispatch(buildEvent,{concurrent: true});
	let duration=Date.now()-start;
	console.log("Build: "+duration/1000+"s");

	devEvent.appData=buildEvent.appData;
	devEvent.importModules=buildEvent.importModules;
}

deployBuild.event="deploy";
deployBuild.priority=5;
export async function deployBuild(deployEvent) {
	deployEvent.options=deployEvent.katnipCli.getOptions();
	deployEvent.tags=["deploy",deployEvent.options.platform];

	let buildEvent=new HookEvent("build",{
		importModules: {},
		appData: {},
		fs: fs,
		cwd: deployEvent.cwd,
		options: deployEvent.options,
		tags: deployEvent.tags
	});

	let start=Date.now();
	await deployEvent.target.dispatch(buildEvent,{concurrent: true});
	let duration=Date.now()-start;
	console.log("Build: "+duration/1000+"s");

	deployEvent.appData=buildEvent.appData;
	deployEvent.importModules=buildEvent.importModules;
}

export async function dev(devEvent) {
	if (!devEvent.tags.includes("node"))
		return;

	devEvent.worker=await importWorker(path.join(__dirname,"katnip-cli-worker.js"));
	await devEvent.worker.start({
		cwd: devEvent.cwd,
		options: devEvent.options,
		appData: devEvent.appData,
		importModules: devEvent.importModules
	});
}

export async function stop(devEvent) {
	if (!devEvent.worker)
		return;

	await devEvent.worker.stop();
	await devEvent.worker.worker.terminate();
	devEvent.worker=undefined;
}

undeploy.priority=5;
export async function undeploy(undeployEvent) {
	undeployEvent.tags=["undeploy",undeployEvent.options.platform];
}