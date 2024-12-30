import {DeclaredError} from "katnip";
import * as TOML from "@ltd/j-toml";
import path from "path";
import fs from "fs";

export function init(ev) {
	if (!fs.existsSync(ev.options.publicDir)) {
		console.log("Creating content dir: "+ev.options.publicDir);
		fs.mkdirSync(ev.options.publicDir);
	}
}

export function initCli(initCliEvent) {
	initCliEvent.program.option("--publicDir <path>","Directory to serve as plain static assets.","public");
}

export function build(buildEvent) {
	if (buildEvent.options.platform=="cloudflare") {
		let wranglerPath=path.join(buildEvent.cwd,"wrangler.json");
		let wrangler=JSON.parse(fs.readFileSync(wranglerPath,"utf8"));
		if (!wrangler.site || !wrangler.site.bucket) {
			console.log("Updating wrangler.json with content bucket...");
			wrangler.site={bucket: buildEvent.options.publicDir};
			fs.writeFileSync(wranglerPath,JSON.stringify(wrangler,null,2));
		}

		if (wrangler.site.bucket!=buildEvent.options.publicDir) {
			throw new DeclaredError(
				"The site bucket in wrangler.json is different from the project publicDir. "+
				"Remove the setting from wrangler.json, and it will be set automatically."
			);
		}
	}
}