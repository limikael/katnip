import {findKatnipModules} from "katnip";

export async function build(buildEv) {
	let modulePaths=findKatnipModules("rpc",{
		reqConditions: "rpc"
	});

	if (modulePaths.length>1)
		throw new Error("More than one rpc module: "+JSON.stringify(modulePaths));

	if (modulePaths.length) {
		buildEv.importModules.rpc=modulePaths[0];
	}

	else
		console.log("rpc disabled");
}