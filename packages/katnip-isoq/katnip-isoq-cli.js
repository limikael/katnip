import isoqBundler from "isoq/bundler";
import {findKatnipModules} from "katnip";
import fs from "fs";
import path from "path";

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
	let modulePaths=findKatnipModules("browser",{
		reqConditions: "browser"
	});
	if (modulePaths.length!=1)
		throw new Error("Expected 1 browser entry point, found "+modulePaths.length);

	let wrappers=findKatnipModules("isoq-wrapper",{
		reqConditions: "isoq-wrapper"
	});
	//console.log("Isoq wrappers:",wrappers);

	let source=createEntryPointSource(modulePaths[0],wrappers);
	fs.mkdirSync("node_modules/.katnip",{recursive: true});
	fs.writeFileSync("node_modules/.katnip/main.jsx",source);

	//console.log("**** isoq build platform: "+buildContext.platform);

	let bundlerOptions={
		entryPoint: path.join(process.cwd(),"node_modules/.katnip/main.jsx"),
		//quiet: true
	};

	if (buildContext.platform=="node")
		bundlerOptions.sourcemap=true;

	await isoqBundler(bundlerOptions);

	buildContext.importModules.isoqRequestHandler="__ISOQ_MIDDLEWARE";
}
