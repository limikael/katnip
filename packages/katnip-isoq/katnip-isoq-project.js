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

function createEntryPointSource(main, wrappers) {
	//console.log(wrappers);

	let source="";
	for (let [index,wrapper] of wrappers.entries())
		source+=`import Wrapper${index} from "${wrapper}";\n`;

	source+=`import Main from "${main}";\n\n`
	source+=`export default function(props) {\n`;
	source+=`  return (\n`;
	for (let i=0; i<wrappers.length; i++)
		source+=`    <Wrapper${i} {...props}>\n`;

	source+=`    <Main {...props}/>\n`;
	for (let i=wrappers.length-1; i>=0; i--)
		source+=`    </Wrapper${i}>\n`;

	source+=`  );\n`;
	source+=`}\n`;

	return source;
}

build.priority=15;
export async function build(buildContext) {
	let isoqEntryPoint=buildContext.options.isoqEntryPoint;

	if (!isoqEntryPoint) {
		//console.error("awefawefewfawef");

		let modulePaths=await resolveHookEntryPoints(buildContext.cwd,"isomain",{
			fs: buildContext.fs,
			keyword: "katnip-plugin"
		});

		if (modulePaths.length!=1) {
			throw new Error("Expected one browser entry point, found "+modulePaths.length);
		}

		isoqEntryPoint=modulePaths[0];
	}

	//console.log("ep: "+isoqEntryPoint);

	let wrappers=await resolveHookEntryPoints(buildContext.cwd,"isoq-wrapper",{
		fs: buildContext.fs,
		keyword: "katnip-plugin"
	});

	wrappers=[...wrappers,...await resolveHookEntryPoints(buildContext.cwd,"app-isoq-wrapper",{
		fs: buildContext.fs,
		keyword: "katnip-plugin"
	})];

	//console.log("Isoq wrappers:",wrappers);

	let source=createEntryPointSource(isoqEntryPoint,wrappers);
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
