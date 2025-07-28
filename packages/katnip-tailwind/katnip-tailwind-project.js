import {tailwindBuild} from "./tailwind-util.js";
import path from "node:path";
import fs, {promises as fsp} from "node:fs";

const TAILWIND_CONFIG_JS=
`export default {
    content: ["./src/**/*.jsx"],
    theme: {
        extend: {
            colors: {
                black: "#000000",
                white: "#ffffff",
            },
        },
    },
}
`;

init.priority=15;
export function init(ev) {
    let tailwindConfigFile=path.join(ev.target.cwd,"tailwind.config.js");
    if (!fs.existsSync(tailwindConfigFile)) {
        //console.log("Creating "+tailwindConfigFile);
        fs.writeFileSync(tailwindConfigFile,TAILWIND_CONFIG_JS);
    }
}

export async function build(buildEv) {
	let project=buildEv.target;

	await tailwindBuild({
		cwd: project.cwd,
		config: path.join(project.cwd,"tailwind.config.js"),
		out: path.join(project.cwd,"public/index.css"),
		input: project.env.config.tailwindInput
	});
}