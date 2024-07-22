import Bundler from "isoq/bundler";
import {resolveHookEntryPoints, mkdirRecursive, HookEvent} from "katnip";
import path from "path-browserify";
import {BuildEvent} from "katnip";

const INDEX_JSX=
`export default function() {
    return (<>
        <div>Hello World</div>
        <div>The project begins here...</div>
    </>);
}
`;

export async function init(ev) {
	let scaffoldEv=ev.clone();
	scaffoldEv.type="scaffold";
	scaffoldEv.isomain=true;

	await ev.hookRunner.emit(scaffoldEv);

	if (scaffoldEv.isomain) {
		let packageJson=JSON.parse(ev.fs.readFileSync("package.json","utf8"));
		if (!packageJson.exports)
			packageJson.exports={};

		if (!packageJson.exports["./isomain"]) {
			packageJson.exports["./isomain"]="./src/main/index.jsx";
			ev.fs.writeFileSync("package.json",JSON.stringify(packageJson,null,2));
		}

		if (!ev.fs.existsSync(packageJson.exports["./isomain"])) {
			console.log("Creating "+packageJson.exports["./isomain"]);
			ev.fs.mkdirSync(path.dirname(packageJson.exports["./isomain"]),{recursive: true});
			ev.fs.writeFileSync(packageJson.exports["./isomain"],INDEX_JSX);
		}
	}
}

function createEntryPointSource(mods) {
	let source="";

	let isoqModules=[];
	for (let i=0; i<mods.length; i++) {
		source+=`import * as isoqModule${i} from "${mods[i]}";\n`
		isoqModules.push(`isoqModule${i}`);
	}

	source+=`let isoqModules=[${isoqModules}];\n`;

	source+=`
		let mains=[];
		for (let mod of isoqModules) {
			if (mod.default)
				mains.push(mod.default);
		}

		let wrappers=[];
		for (let mod of isoqModules) {
			if (mod.Wrapper) {
				if (!mod.Wrapper.priority)
					mod.Wrapper.priority=10;

				wrappers.push(mod.Wrapper);
			}
		}

		// Reverse order, since lower should be outer
		wrappers.sort((a,b)=>b.priority-a.priority);

		export default function(props) {
			let main=[];
			for (let Main of mains)
				main.push(<Main {...props}/>);

			for (let Wrapper of wrappers)
				main=<Wrapper {...props}>{main}</Wrapper>;

			return <>{main}</>
		}
	`;

	return source;
}

build.priority=15;
export async function build(buildContext) {
	let modulePaths=await resolveHookEntryPoints(buildContext.cwd,"isomain",{
		fs: buildContext.fs,
		keyword: "katnip-plugin"
	});

	await buildContext.hookRunner.emit("isoqModules",modulePaths,buildContext);

	//console.log("modulePaths: ",modulePaths);
	let source=createEntryPointSource(modulePaths);
	//console.log(source);

	await mkdirRecursive(path.join(buildContext.cwd,"node_modules/.katnip"),{
		fs: buildContext.fs
	});
	await buildContext.fs.promises.writeFile(
		path.join(buildContext.cwd,"node_modules/.katnip/main.jsx"),
		source
	);

	//console.log("isoqIgnore: "+buildContext.options.isoqIgnore);
	//console.log("**** isoq build platform: "+buildContext.platform);

	let plugins=[];
	await buildContext.hookRunner.emit("isoqEsbuildPlugins",plugins,buildContext);
	let handlerOut=path.join(buildContext.cwd,".target/isoq-request-handler.js");
	let entryPoint=path.join(buildContext.cwd,"node_modules/.katnip/main.jsx");

	if (buildContext.esbuildPlugins)
		plugins.push(...buildContext.esbuildPlugins);

	let bundlerOptions={
		ignore: buildContext.options.isoqIgnore,
		out: handlerOut,
		esbuildPlugins: plugins,
		fs: buildContext.fs,
		esbuild: buildContext.esbuild,
		tmpdir: path.join(buildContext.cwd,".tmp"),
		isoqdir: path.join(buildContext.cwd,"node_modules/isoq"),

		//quiet: true
	};

	/*if (buildContext.platform=="node")
		bundlerOptions.sourcemap=true;*/

	let bundler=new Bundler(entryPoint,bundlerOptions);
	await bundler.bundle();

	buildContext.importModules.isoqRequestHandler=handlerOut;
}
