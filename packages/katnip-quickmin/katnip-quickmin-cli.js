import fs from "fs";
import {parse as parseYaml} from "yaml";

export function build(ev) {
	let conf=parseYaml(fs.readFileSync("quickmin.yaml","utf8"));

	ev.data.quickminConf=conf;
}