import path from "node:path";
import fs, {promises as fsp} from "node:fs";
import {isoqBundle} from "isoq/commands";

const INDEX_JSX=
`export default function() {
    return (<>
        <div class="mb-5 font-bold">Hello World</div>
        <div>The project begins here...</div>
    </>);
}
`;

export async function init(ev) {
	let project=ev.target;

	let pkg=await project.processProjectFile("package.json","json",async pkg=>{
		if (!pkg.exports)
			pkg.exports={};

		if (!pkg.exports["./isomain"])
			pkg.exports["./isomain"]="src/main/client.jsx";
	});

	let fullEp=path.join(ev.target.cwd,pkg.exports["./isomain"]);
	if (!fs.existsSync(fullEp)) {
		//console.log("init isoq");
		fs.mkdirSync(path.dirname(fullEp),{recursive: true});
		fs.writeFileSync(fullEp,INDEX_JSX);
	}
}

export async function build(buildEvent) {
	let project=buildEvent.target;
	let modulePaths=await project.resolveEntrypoints("isomain");
	if (!modulePaths.length)
		return;

	if (modulePaths.length>1)
		throw new Error("More than one client entrypoint.");

	let wrapperPaths=await project.resolveEntrypoints("isowrap");
	//console.log(wrapperPaths);

	let config={...project.env.config};

	if (config.clientPurgeOldJs===undefined)
		config.clientPurgeOldJs=true;

	if (config.clientMinify===undefined)
		config.clientMinify=true;

	let handlerOut=path.resolve(project.cwd,".target/isoq-request-handler.js");
	let bundleOptions={
		entrypoint: modulePaths[0],
		tmpdir: path.resolve(project.cwd,".target"),
		out: handlerOut,
		contentdir: path.resolve(project.cwd,"public"),
		wrappers: wrapperPaths,
		quiet: true,
		minify: config.clientMinify,
		splitting: config.clientSplitting,
		purgeOldJs: config.clientPurgeOldJs
	}

	if (buildEvent.target.platform=="node" && 
			buildEvent.target.mode=="dev" &&
			config.clientSourcemap!==false) {
		bundleOptions={...bundleOptions,
			sourcemap: true,
			sourceRoot: path.resolve(project.cwd),
		};
	}

	await isoqBundle(bundleOptions);

	buildEvent.importModules.isoqRequestHandler=handlerOut;
}
