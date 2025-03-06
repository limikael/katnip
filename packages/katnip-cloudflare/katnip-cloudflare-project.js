import fs from "fs";
import {resolveHookEntryPoints, findNodeBin, runCommand, HookEvent, DeclaredError, arrayify} from "katnip";
import path from "path";
import WORKER_STUB from "./worker-stub.js";
import {fileURLToPath} from 'url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));

export async function initCli(initCliEvent) {
	let option;

	option=initCliEvent.getOptionSpec("dev","platform");
	option.choices([...option.argChoices,"cloudflare"]);

	option=initCliEvent.getOptionSpec("deploy","platform");
	option.choices([...option.argChoices,"cloudflare"]);

	option=initCliEvent.getOptionSpec("undeploy","platform");
	option.choices([...option.argChoices,"cloudflare"]);
}

buildCreateWrangler.priority=5;
buildCreateWrangler.event="build";
export async function buildCreateWrangler(buildEvent) {
	if (!buildEvent.tags.includes("cloudflare"))
		return;

	let wrangler={};
	let wranglerPath=path.join(buildEvent.cwd,"wrangler.json");
	if (fs.existsSync(wranglerPath))
		wrangler=JSON.parse(fs.readFileSync(wranglerPath));

	let packageJsonPath=path.join(buildEvent.cwd,"package.json");
	let packageJson=JSON.parse(fs.readFileSync(packageJsonPath));

	if (wrangler.name && wrangler.name!=packageJson.name)
		throw new DeclaredError(
			"The name field in wrangler.json is specified, and it is different from the package name. "+
			"Please set it to the same as the package name or remove it."
		);

	if (wrangler.main && wrangler.main!="node_modules/.katnip/worker.js")
		throw new DeclaredError(
			"The main entry point in wrangler.json is manually set to something different than "+
			"expected, please remove it and it will be set automatically."
		);

	wrangler.name=packageJson.name;
	wrangler.main="node_modules/.katnip/worker.js";

	if (!wrangler.compatibility_date)
		wrangler.compatibility_date = "2024-12-18";

	let schedule=arrayify(buildEvent.options.schedule);
	if (schedule.length) {
		if (!wrangler.triggers)
			wrangler.triggers={};

		if (!wrangler.triggers.crons)
			wrangler.triggers.crons=[];

		for (let scheduleExpr of schedule)
			if (!wrangler.triggers.crons.includes(scheduleExpr))
				wrangler.triggers.crons.push(scheduleExpr);
	}

	fs.writeFileSync(wranglerPath,JSON.stringify(wrangler,null,2));
}

buildWorker.priority=20;
buildWorker.event="build";
export async function buildWorker(buildEvent) {
	if (!buildEvent.tags.includes("cloudflare"))
		return;

	console.log("Building worker...");

	let importStatements=[];
	let importModuleNames=[];
	for (let k in buildEvent.importModules) {
		importStatements.push(`import * as ${k} from "${buildEvent.importModules[k]}";`);
		importModuleNames.push(k);
	}

	let listenerImports=[];
	let listenerNames=[];

	//let importPaths=findKatnipModules(["server","workerd"],{reqConditions: "server"});
	let importPaths=await resolveHookEntryPoints({
		cwd: buildEvent.cwd,
		importPath: "katnip-server-hooks",
		keyword: "katnip-plugin",
		conditions: ["workerd"],
		fs
	});

	//console.log("resolved entry points... ",importPaths);

	for (let [index,fn] of importPaths.entries()) {
		listenerImports.push(`import * as listener${index} from "${fn}";`);
		listenerNames.push(`listener${index}`);
	}

	let workerSource=WORKER_STUB.replace("$$WORKER_DATA$$",
		importStatements.join("\n")+"\n\n"+
		listenerImports.join("\n")+"\n\n"+
		`const workerData={\n`+
		`    importModules: {${importModuleNames.join(",")}},\n`+
		`    listenerModules: [${listenerNames.join(",")}],\n`+
		`    options: ${JSON.stringify(buildEvent.options)},\n`+
		`    appData: ${JSON.stringify(buildEvent.appData)}\n`+
		`};`
	);

	fs.mkdirSync(path.join(buildEvent.cwd,"node_modules/.katnip"),{recursive: true});
	fs.writeFileSync(path.join(buildEvent.cwd,"node_modules/.katnip/worker.js"),workerSource);
}

export function dev(devEvent) {
	if (!devEvent.tags.includes("cloudflare"))
		return;

    let wranglerInfo=new HookEvent("wranglerInfo",{...devEvent});
    devEvent.target.dispatch(wranglerInfo);

	console.log("Starting cloudflare dev server...");
	let wranglerOptions=["dev",
		"--host","localhost:"+devEvent.options.port,
		"--port",devEvent.options.port,
		"--config",path.join(devEvent.cwd,"wrangler.json"),
		"--test-scheduled"
	];

	return new Promise((resolve, reject)=>{
		devEvent.wranglerCommand=runCommand(wranglerInfo.wranglerBin,wranglerOptions,{
			passthrough: true,
			env: wranglerInfo.wranglerEnv
		});

		devEvent.wranglerCommand.then(resolve);
		devEvent.wranglerCommand.catch(reject);

		//console.log(devEvent.wranglerCommand.childProcess);

		devEvent.wranglerCommand.childProcess.stdout.on("data",data=>{
			if (data.includes("[wrangler:inf] Ready on"))
				resolve();
		})
	});
}

export async function stop(devEvent) {
	if (devEvent.wranglerCommand) {
		console.log("stopping wrangler");
		devEvent.wranglerCommand.childProcess.kill();
		devEvent.wranglerCommand=undefined;
	}
}

deployServices.priority=5;
deployServices.event="deploy";
export async function deployServices(deployEvent) {
	if (!deployEvent.tags.includes("cloudflare"))
		return;

	console.log("Activating cloudflare services...");
	let wranglerPath=path.join(deployEvent.cwd,"wrangler.json");
	let wrangler=JSON.parse(fs.readFileSync(wranglerPath));
    let wranglerInfo=new HookEvent("wranglerInfo",{...deployEvent});
    deployEvent.target.dispatch(wranglerInfo);

	if (wrangler.r2_buckets) {
		for (let bucket of wrangler.r2_buckets) {
			if (String(bucket.bucket_name)=="undefined") {
				console.log("Creating R2 bucket...");
				bucket.bucket_name=wrangler.name;
				let wranglerOptions=[
					"--config",wranglerPath,
                    "r2","bucket","create",bucket.bucket_name,
				];

                await runCommand(wranglerInfo.wranglerBin,wranglerOptions,{
                    passthrough: true,
                    env: wranglerInfo.wranglerEnv
                });

	            fs.writeFileSync(wranglerPath,JSON.stringify(wrangler,null,2));
			}
		}
	}

	if (wrangler.d1_databases) {
		for (let database of wrangler.d1_databases) {
			if (String(database.database_id)=="undefined") {
				console.log("Creating D1 database...");
				let wranglerOptions=[
					"--config",wranglerPath,
                    "d1","create",wrangler.name,
				];

                let wranglerOut=await runCommand(wranglerInfo.wranglerBin,wranglerOptions,{
                	passthrough: true,
                	env: wranglerInfo.wranglerEnv
                });

	            let matches=wranglerOut.match(/database_id\s*=\s*\"([^\"]*)\"/)
	            if (!matches || !matches[1])
	                throw new DeclaredError("Unable to parse wrangler output.");

	            let databaseId=matches[1];
	            database.database_id=databaseId;

	            fs.writeFileSync(wranglerPath,JSON.stringify(wrangler,null,2));
			}
		}
	}
}

deploy.priority=20;
export async function deploy(deployEvent) {
	if (!deployEvent.tags.includes("cloudflare"))
		return;

	console.log("Deploying worker...");
	let wranglerPath=path.join(deployEvent.cwd,"wrangler.json");

	/*let env={...process.env};
	if (ev.options.cfToken)
		env.CLOUDFLARE_API_TOKEN=ev.options.cfToken;*/

    let wranglerInfo=new HookEvent("wranglerInfo",{...deployEvent});
    deployEvent.target.dispatch(wranglerInfo);

	let wranglerOptions=[
		"--config",wranglerPath,
		"deploy"
	];
	await runCommand(wranglerInfo.wranglerBin,wranglerOptions,{
		passthrough: true,
		env: wranglerInfo.wranglerEnv
	});
}

export async function undeploy(undeployEvent) {
	if (!undeployEvent.tags.includes("cloudflare"))
		return;

	console.log("Deactivating cloudflare services...");
	let wranglerPath=path.join(undeployEvent.cwd,"wrangler.json");
	let wrangler=JSON.parse(fs.readFileSync(wranglerPath));
    let wranglerInfo=new HookEvent("wranglerInfo",{...undeployEvent});
    undeployEvent.target.dispatch(wranglerInfo);

	if (wrangler.r2_buckets) {
		for (let bucket of wrangler.r2_buckets) {
			if (String(bucket.bucket_name)!="undefined") {
				console.log("Removing R2 bucket...");
				let wranglerOptions=[
					"--config",wranglerPath,
                    "r2","bucket","delete",bucket.bucket_name,
				];

                await runCommand(wranglerInfo.wranglerBin,wranglerOptions,{
                    passthrough: true,
                    env: wranglerInfo.wranglerEnv
                });

                bucket.bucket_name="undefined";
	            fs.writeFileSync(wranglerPath,JSON.stringify(wrangler,null,2));
			}
		}
	}

	if (wrangler.d1_databases) {
		for (let database of wrangler.d1_databases) {
			if (String(database.database_id)!="undefined") {
				console.log("Removing D1 database...");
				let wranglerOptions=[
					"--config",wranglerPath,
                    "d1","delete",database.database_name,
				];

                await runCommand(wranglerInfo.wranglerBin,wranglerOptions,{
                    passthrough: true,
                    env: wranglerInfo.wranglerEnv
                });

                database.database_id="undefined";
	            fs.writeFileSync(wranglerPath,JSON.stringify(wrangler,null,2));
			}
		}
	}

	console.log("Removing Worker...");
	let wranglerOptions=[
		"--config",wranglerPath,
        "delete"
	];

    await runCommand(wranglerInfo.wranglerBin,wranglerOptions,{
        passthrough: true,
        env: wranglerInfo.wranglerEnv
    });
}

export function wranglerInfo(ev) {
	ev.wranglerBin=findNodeBin(ev.cwd,"wrangler");
	ev.wranglerEnv={...process.env};

	if (ev.options.cfToken)
		ev.wranglerEnv.CLOUDFLARE_API_TOKEN=ev.options.cfToken;
}