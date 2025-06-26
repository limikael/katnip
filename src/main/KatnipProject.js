import fs, {promises as fsp} from "node:fs";
import path from "node:path";
import {DeclaredError} from "../utils/js-util.js";
import JSON5 from "json5";
import {isoqBundle} from "isoq/bundler";
import {mikrokatServe} from "mikrokat";
import {fileURLToPath} from 'node:url';
import {tailwindBuild} from "../utils/tailwind-util.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

export default class KatnipProject {
	constructor({cwd}) {
		this.cwd=cwd;
	}

	async load() {
		this.config={};

		if (!fs.existsSync(path.join(this.cwd,"katnip.json")))
			throw new DeclaredError("No katnip.json file.");

		this.config={
			...this.config,
			...JSON5.parse(await fsp.readFile(path.join(this.cwd,"katnip.json")))
		}
	}

	async build() {
		await tailwindBuild({
			cwd: this.cwd
		});

		await isoqBundle({
			entrypoint: path.resolve(this.cwd,this.config.client),
			out: path.resolve(this.cwd,".target/isoq-request-handler.js"),
			//quiet: true
		});
	}

	async serve() {
		await this.build();

		await mikrokatServe({
			cwd: this.cwd,
			port: 3000,
			config: {
				main: path.join(__dirname,"server.js"),
				imports: [
					{import: "isoqRequestHandler", from: "./.target/isoq-request-handler.js"}
				]
			}
		});
	}
}