import BrowserBundler from "isoq/browser-bundler";
import path from "path-browserify";

build.priority=15;
export async function build(buildEv) {
	let packageJsonPath=path.join(buildEv.cwd,"package.json");
	let packageJson=JSON.parse(await buildEv.fsPromises.readFile(packageJsonPath,"utf8"));

	if (!packageJson.exports.browser)
		throw new Error("No app entry point.");

	let entryPoint=path.join(buildEv.cwd,packageJson.exports.browser);
	let bundlerOptions={
		out: path.join(buildEv.cwd,".target/isoq-request-handler.js"),
		fsPromises: buildEv.fsPromises,
		esbuild: buildEv.esbuild,
		esbuildPlugins: buildEv.esbuildPlugins,
		tmpdir: path.join(buildEv.cwd,".tmp"),
		isoqdir: path.join(buildEv.cwd,"node_modules/isoq"),
		quiet: true
	};

	/*if (buildContext.platform=="node")
		bundlerOptions.sourcemap=true;*/

	let bundler=new BrowserBundler(entryPoint,bundlerOptions);
	await bundler.bundle();

	buildEv.importModules.isoqRequestHandler=path.join(buildEv.cwd,".target/isoq-request-handler.js");
}