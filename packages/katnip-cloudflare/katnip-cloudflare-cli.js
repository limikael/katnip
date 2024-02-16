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

export async function cfdev(ev) {
	let buildEvent=new BuildEvent({
		options: ev.options,
		platform: "workerd"
	});

	await ev.hookRunner.emit(buildEvent);

	let wranglerBin=findNodeBin(process.cwd(),"wrangler");
	await runCommand(wranglerBin,["dev"],{
		passthrough: true
	});
}

export async function cfdeploy(ev) {
	let buildEvent=new BuildEvent({
		options: ev.options,
		platform: "workerd"
	});

	await ev.hookRunner.emit(buildEvent);

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
	let wrangerPath=path.join(process.cwd(),"wrangler.toml");
	if (fs.existsSync(wrangerPath))
		wrangler=TOML.parse(fs.readFileSync(wrangerPath,"utf8"));

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

	if (!wrangler.site || !wrangler.site.bucket) {
		console.log("Updating wrangler.toml with content bucket...");
		wrangler.site=TOML.Section({bucket: ev.options.publicDir});
	}

	if (wrangler.site.bucket!=ev.options.publicDir) {
		throw new DeclaredError(
			"The site bucket in wrangler.toml is different from the project publicDir. "+
			"Remove the setting from wrangler.toml, and it will be set automatically."
		);
	}

	wrangler.name=packageJson.name;
	wrangler.main=".target/worker.js";

	if (!wrangler.compatibility_date)
		wrangler.compatibility_date = "2023-10-30"

	fs.writeFileSync(wrangerPath,TOML.stringify(wrangler,{newline: "\n"}));
}

build.priority=20;
export function build(ev) {
	if (ev.platform=="workerd") {
		console.log("Generating worker...");
		checkWranglerToml(ev);

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