import path from "node:path";
import {isoqBundle, isoqGetEsbuildOptions} from "isoq/bundler";

export async function build(buildEvent) {
	let project=buildEvent.target;
	let modulePaths=await project.resolveEntrypoints("isomain");
	if (!modulePaths.length)
		return;

	if (modulePaths.length>1)
		throw new Error("More than one client entrypoint.");

	let config={...project.config};

	if (config.clientPurgeOldJs===undefined)
		config.clientPurgeOldJs=true;

	if (config.clientMinify===undefined)
		config.clientMinify=true;

	let handlerOut=path.resolve(project.cwd,".target/isoq-request-handler.js");

	await isoqBundle({
		entrypoint: modulePaths[0],
		out: handlerOut,
		contentdir: path.resolve(project.cwd,"public"),
		//wrappers: wrappers,
		quiet: true,
		minify: config.clientMinify,
		splitting: config.clientSplitting,
		purgeOldJs: config.clientPurgeOldJs
	});

	buildEvent.importModules.isoqRequestHandler=handlerOut;
}
