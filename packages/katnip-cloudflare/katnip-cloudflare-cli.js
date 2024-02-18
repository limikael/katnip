import {BuildEvent, findKatnipModules, DeclaredError, runCommand, findNodeBin} from "katnip";
import fs from "fs";
import path from "path";
import {fileURLToPath} from 'url';
import * as TOML from "@ltd/j-toml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function initcli(spec) {
	spec.addCommand("cfdev","Start wrangler development server.");
	spec.addCommand("cfdeploy","Deploy to Cloudflare Workers.");
	spec.addGlobalOption("publicDir",{
		description: "Directory to serve as plain static assets.",
		default: "public"
	});
}

export async function init(ev) {
	let packageJson=JSON.parse(fs.readFileSync("package.json","utf8"));
	if (!packageJson.exports)
		packageJson.exports={};

	let updated=false;

	if (!packageJson.scripts.cfdev) {
		packageJson.scripts.cfdev="katnip cfdev";
		updated=true;
	}

	if (!packageJson.scripts.deploy) {
		packageJson.scripts.deploy="katnip cfdeploy";
		updated=true;
	}

	if (updated) {
		console.log("Updating cloudflare scripts in package.json...")
		fs.writeFileSync("package.json",JSON.stringify(packageJson,null,2));
	}
}

export async function registerHooks(hookRunner) {
	hookRunner.on("cfdev",precfdev);
	hookRunner.on("cfdev",postcfdev);
	hookRunner.on("cfdeploy",precfdeploy);
	hookRunner.on("cfdeploy",postcfdeploy);
	hookRunner.on("build",prebuild);
}

precfdev.priority=1;
async function precfdev(ev) {
	console.log("Building as starting local cloudflare env...");
}

export async function cfdev(ev) {
	let buildEvent=new BuildEvent({
		options: ev.options,
		platform: "workerd"
	});

	await ev.hookRunner.emit(buildEvent);
}

postcfdev.priority=20;
async function postcfdev(ev) {
	let wranglerBin=findNodeBin(process.cwd(),"wrangler");
	await runCommand(wranglerBin,["dev"],{
		passthrough: true
	});
}

precfdeploy.priority=1;
async function precfdeploy(ev) {
	console.log("Building and deploying cloudflare worker...");
}

export async function cfdeploy(ev) {
	let buildEvent=new BuildEvent({
		options: ev.options,
		platform: "workerd"
	});

	await ev.hookRunner.emit(buildEvent);
}

postcfdeploy.priority=20;
async function postcfdeploy(ev) {
	let env={...process.env};
	if (ev.options.cfToken)
		env.CLOUDFLARE_API_TOKEN=ev.options.cfToken;

	let wranglerBin=findNodeBin(process.cwd(),"wrangler");
	await runCommand(wranglerBin,["deploy"],{
		passthrough: true,
		env: env
	});
}

function checkWranglerToml(ev) {
	let wrangler={};
	let wranglerPath=path.join(process.cwd(),"wrangler.toml");
	if (fs.existsSync(wranglerPath))
		wrangler=TOML.parse(fs.readFileSync(wranglerPath,"utf8"));

	let packageJson=JSON.parse(fs.readFileSync("package.json","utf8"));

	if (wrangler.name && wrangler.name!=packageJson.name)
		throw new DeclaredError(
			"The name field in wrangler.toml is specified, and it is different from the package name. "+
			"Please set it to the same as the package name or remove it."
		);

	if (wrangler.main && wrangler.main!=".target/worker.js")
		throw new DeclaredError(
			"The main entry point in wrangler.toml is manually set to something different than "+
			".target/worker.js, please remove it and it will be set automatically."
		);

	wrangler.name=packageJson.name;
	wrangler.main=".target/worker.js";

	if (!wrangler.compatibility_date)
		wrangler.compatibility_date = "2023-10-30"

	fs.writeFileSync(wranglerPath,TOML.stringify(wrangler,{newline: "\n"}));
}

prebuild.priority=5;
function prebuild(ev) {
	if (ev.platform=="workerd")
		checkWranglerToml(ev);
}

build.priority=20;
export function build(ev) {
	if (ev.platform=="workerd") {
		let importStatements=[];
		let importModuleNames=[];
		for (let k in ev.importModules) {
			importStatements.push(`import * as ${k} from "${ev.importModules[k]}";`);
			importModuleNames.push(k);
		}

		let listenerImports=[];
		let listenerNames=[];

		let importPaths=findKatnipModules(["server","workerd"],{reqConditions: "server"});
		for (let [index,fn] of importPaths.entries()) {
			listenerImports.push(`import * as listener${index} from "${fn}";`);
			listenerNames.push(`listener${index}`);
		}

		let workerSource=fs.readFileSync(path.join(__dirname,"worker-stub.js"),"utf8");
		workerSource=workerSource.replace("$$WORKER_DATA$$",
			importStatements.join("\n")+"\n\n"+
			listenerImports.join("\n")+"\n\n"+
			`const workerData={\n`+
			`    importModules: {${importModuleNames.join(",")}},\n`+
			`    listenerModules: [${listenerNames.join(",")}],\n`+
			`    options: ${JSON.stringify(ev.options)},\n`+
			`    data: ${JSON.stringify(ev.data)}\n`+
			`};`
		);

		fs.mkdirSync(path.join(process.cwd(),".target"),{recursive: true});
		fs.writeFileSync(path.join(process.cwd(),".target/worker.js"),workerSource);
	}
}