import {resolveHookEntryPoints, resolveModuleEntryPoint, pkgSetExport} from "katnip";
import path from "path-browserify";

const API_JS=
`export default class Api {
	constructor(ev) {
		this.ev=ev;
	}

	// Will be callable from the client with:
	// import {useRpc} from "katnip-rpc";
	// let rpc=useRpc();
	// await rpc.myfunc(/*...*/);
	async myfunc(myparam) {
		// ...
	}
}
`;

init.priority=15;
export async function init(ev) {
	let ep=await resolveModuleEntryPoint({
		cwd: ev.cwd,
		importPath: "katnip-rpc-api",
		fs: ev.fs,
	});

	if (!ep) {
		let pkgPath=path.join(ev.cwd,"package.json");
		let pkg=JSON.parse(ev.fs.readFileSync(pkgPath));
		pkg.exports=pkgSetExport(pkg.exports,{
			importPath: "./katnip-rpc-api",
			target: "./src/main/Api.js"
		});

		ev.fs.writeFileSync(pkgPath,JSON.stringify(pkg,null,2));
		ep=await resolveModuleEntryPoint({
			importPath: "katnip-rpc-api", 
			pkg: pkg
		});
	}

	let fullEp=path.join(ev.cwd,ep);
	if (!ev.fs.existsSync(fullEp)) {
		//console.log("init isoq");
		ev.fs.mkdirSync(path.dirname(fullEp),{recursive: true});
		ev.fs.writeFileSync(fullEp,API_JS);
	}
}

export async function build(buildEvent) {
	//console.log("build rpc.....");

	let modulePaths=await resolveHookEntryPoints(buildEvent.cwd,"katnip-rpc-api",{
		fs: buildEvent.fs,
		keyword: "katnip-plugin"
	});

	//console.log("rpc paths: ",modulePaths);

	if (modulePaths.length>1)
		throw new Error("More than one rpc module: "+JSON.stringify(modulePaths));

	if (modulePaths.length==1)
		buildEvent.importModules.rpc=modulePaths[0];
}