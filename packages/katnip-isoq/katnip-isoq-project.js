import Bundler from "isoq/bundler";
import {resolveHookEntryPoints, pkgSetExport, resolveModuleEntryPoint} from "katnip";
import path from "path-browserify";

const INDEX_JSX=
`export default function() {
    return (<>
        <div>Hello World</div>
        <div>The project begins here...</div>
    </>);
}
`;

export async function initCli(initCliEvent) {
	/*let devCommand=initCliEvent.getCommandByName("dev");

	devCommand.option("--isoqExposeExports","Expose isoq exports.",false);*/
}

export async function init(ev) {
	let ep=await resolveModuleEntryPoint({
		cwd: ev.cwd,
		importPath: "isomain",
		fs: ev.fs,
	});

	if (!ep) {
		let pkgPath=path.join(ev.cwd,"package.json");
		let pkg=JSON.parse(ev.fs.readFileSync(pkgPath));
		pkg.exports=pkgSetExport(pkg.exports,{
			importPath: "./isomain",
			target: "./src/main/index.jsx"
		});

		ev.fs.writeFileSync(pkgPath,JSON.stringify(pkg,null,2));
		ep=await resolveModuleEntryPoint({importPath: "./isomain", pkg: pkg});
	}

	let fullEp=path.join(ev.cwd,ep);
	if (!ev.fs.existsSync(fullEp)) {
		//console.log("init isoq");
		ev.fs.mkdirSync(path.dirname(fullEp),{recursive: true});
		ev.fs.writeFileSync(fullEp,INDEX_JSX);
	}
}

function createEntryPointSource(mods) {
	let source="";

	let isoqModules=[];
	for (let i=0; i<mods.length; i++) {
		source+=`import * as isoqModule${i} from "${mods[i]}";\n`;
		source+=`export * from "${mods[i]}";\n`;
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

export async function build(buildEvent) {
	let modulePaths=await resolveHookEntryPoints(buildEvent.cwd,"isomain",{
		fs: buildEvent.fs,
		keyword: "katnip-plugin"
	});

	//fix await buildContext.hookRunner.emit("isoqModules",modulePaths,buildContext);

	//console.log("modulePaths: ",modulePaths);
	let source=createEntryPointSource(modulePaths);
	//console.log(source);

	await buildEvent.fs.promises.mkdir(
		path.join(buildEvent.cwd,"node_modules/.katnip"),
		{recursive: true}
	);
	await buildEvent.fs.promises.writeFile(
		path.join(buildEvent.cwd,"node_modules/.katnip/main.jsx"),
		source
	);
	await buildEvent.fs.promises.writeFile(
		path.join(buildEvent.cwd,"node_modules/.katnip/package.json"),
		'{"type":"module"}'
	);

	//console.log("isoqIgnore: "+buildContext.options.isoqIgnore);
	//console.log("**** isoq build platform: "+buildContext.platform);

	let plugins=[];
	// fix await buildContext.hookRunner.emit("isoqEsbuildPlugins",plugins,buildContext);
	let handlerOut=path.join(buildEvent.cwd,"node_modules/.katnip/isoq-request-handler.js");
	let entryPoint=path.join(buildEvent.cwd,"node_modules/.katnip/main.jsx");

	if (buildEvent.esbuildPlugins)
		plugins.push(...buildEvent.esbuildPlugins);

	//console.log("public: "+buildContext.options.publicDir);

	let bundlerOptions={
		minify: false,
		ignore: buildEvent.options.isoqIgnore,
		out: handlerOut,
		esbuildPlugins: plugins,
		fs: buildEvent.fs,
		esbuild: buildEvent.esbuild,
		tmpdir: path.join(buildEvent.cwd,"node_modules/.tmp"),
		isoqdir: path.join(buildEvent.cwd,"node_modules/isoq"),
		exposeExports: buildEvent.options.isoqExposeExports,
		pathAliases: buildEvent.options.isoqPathAliases
		//quiet: true
	};

	if (buildEvent.options.publicDir)
		bundlerOptions.contentdir=path.join(buildEvent.cwd,buildEvent.options.publicDir);

	/*if (buildContext.platform=="node")
		bundlerOptions.sourcemap=true;*/

	let bundler=new Bundler(entryPoint,bundlerOptions);
	await bundler.bundle();

	buildEvent.importModules.isoqRequestHandler=handlerOut;

	if (buildEvent.importModuleOptions)
		buildEvent.importModuleOptions.isoqRequestHandler={bundle: false};
}
