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

export function initcli(spec) {
	spec.addGlobalOption("publicDir",{
		description: "Directory to serve as plain static assets.",
		default: "public"
	});
}

export function build(ev) {
	if (ev.platform=="workerd") {
		let wranglerPath=path.join(process.cwd(),"wrangler.toml");
		let wrangler=TOML.parse(fs.readFileSync(wranglerPath,"utf8"));
		if (!wrangler.site || !wrangler.site.bucket) {
			console.log("Updating wrangler.toml with content bucket...");
			wrangler.site=TOML.Section({bucket: ev.options.publicDir});
			fs.writeFileSync(wranglerPath,TOML.stringify(wrangler,{newline: "\n"}));
		}

		if (wrangler.site.bucket!=ev.options.publicDir) {
			throw new DeclaredError(
				"The site bucket in wrangler.toml is different from the project publicDir. "+
				"Remove the setting from wrangler.toml, and it will be set automatically."
			);
		}
	}
}