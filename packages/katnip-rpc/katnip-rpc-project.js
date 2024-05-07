import {resolveHookEntryPoints} from "katnip";
//import fs from "fs";
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
export function init(ev) {
	/*let packageJson=JSON.parse(fs.readFileSync("package.json","utf8"));
	if (!packageJson.exports)
		packageJson.exports={};

	if (!packageJson.exports.rpc) {
		packageJson.exports.rpc="src/main/Api.js";
		fs.writeFileSync("package.json",JSON.stringify(packageJson,null,2));
	}

	if (!fs.existsSync(packageJson.exports.rpc)) {
		console.log("Creating "+packageJson.exports.rpc);
		fs.mkdirSync(path.dirname(packageJson.exports.rpc),{recursive: true});
		fs.writeFileSync(packageJson.exports.rpc,API_JS);
	}*/
}

export async function build(buildEv) {
	let modulePaths=await resolveHookEntryPoints(buildEv.cwd,"katnip-rpc-api",{
		fs: buildEv.fs,
		keyword: "katnip-plugin"
	});

	//console.log("rpc paths: ",modulePaths);

	if (modulePaths.length>1)
		throw new Error("More than one rpc module: "+JSON.stringify(modulePaths));

	if (modulePaths.length==1)
		buildEv.importModules.rpc=modulePaths[0];
}