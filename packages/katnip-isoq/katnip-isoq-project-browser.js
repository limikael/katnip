import {testFunc} from "./test.js";
import BrowserBundler from "isoq/browser-bundler";
import path from "path-browserify";

build.priority=15;
export async function build(buildEv) {
	let entryPoint=path.join(buildEv.cwd,"main.jsx");
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