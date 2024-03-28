import Bundler from "isoq/bundler";
import {findKatnipModules} from "katnip";
import fs from "fs";
import path from "path";

const INDEX_JSX=
`export default function() {
    return (<>
        <div>Hello World</div>
        <div>The project begins here...</div>
    </>);
}
`;

export function init(ev) {
	let packageJson=JSON.parse(fs.readFileSync("package.json","utf8"));
	if (!packageJson.exports)
		packageJson.exports={};

	if (!packageJson.exports.browser) {
		packageJson.exports.browser="src/main/index.jsx";
		fs.writeFileSync("package.json",JSON.stringify(packageJson,null,2));
	}

	if (!fs.existsSync(packageJson.exports.browser)) {
		console.log("Creating "+packageJson.exports.browser);
		fs.mkdirSync(path.dirname(packageJson.exports.browser),{recursive: true});
		fs.writeFileSync(packageJson.exports.browser,INDEX_JSX);
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
	let modulePaths=findKatnipModules("browser",{
		reqConditions: "browser"
	});
	if (modulePaths.length!=1)
		throw new Error("Expected 1 browser entry point, found "+modulePaths.length);

	let wrappers=findKatnipModules("isoq-wrapper",{
		reqConditions: "isoq-wrapper"
	});
	wrappers=[...wrappers,...findKatnipModules("app-isoq-wrapper",{
		reqConditions: "app-isoq-wrapper"
	})];

	//console.log("Isoq wrappers:",wrappers);

	let source=createEntryPointSource(modulePaths[0],wrappers);
	fs.mkdirSync("node_modules/.katnip",{recursive: true});
	fs.writeFileSync("node_modules/.katnip/main.jsx",source);

	//console.log("**** isoq build platform: "+buildContext.platform);

	let entryPoint=path.join(process.cwd(),"node_modules/.katnip/main.jsx")
	let bundlerOptions={
		out: ".target/isoq-request-handler.js"
		//quiet: true
	};

	if (buildContext.platform=="node")
		bundlerOptions.sourcemap=true;

	let bundler=new Bundler(entryPoint,bundlerOptions);
	await bundler.bundle(); //isoqBundler(bundlerOptions);

	buildContext.importModules.isoqRequestHandler=path.resolve(".target/isoq-request-handler.js");
}
