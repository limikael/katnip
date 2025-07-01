import {loadPlugins, PluginEvent} from "../../src/utils/plugins.js";
import path from "node:path";
import {fileURLToPath} from 'node:url';
import fs, {promises as fsp} from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("plugins",()=>{
	it("can plug",async ()=>{
		await fsp.rm(path.join(__dirname,"data/node_modules"),{recursive: true, force: true});
		await fsp.cp(
			path.join(__dirname,"data/node_modules.keep"),
			path.join(__dirname,"data/node_modules"),
			{recursive: true}
		)

		let pluginTarget=await loadPlugins({
			cwd: path.join(__dirname,"data"),
			keyword: "katnip-plugin",
			export: "katnip-build"
		});

		let ev=new PluginEvent("build");
		await pluginTarget.dispatch(ev);

		expect(ev.hello).toEqual("was called");

		//console.log(pluginTarget);
	});
});