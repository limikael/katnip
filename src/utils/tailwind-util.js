import tailwind from "tailwindcss";
import postcss from 'postcss';
import autoprefixer from "autoprefixer";
import path from "node:path";
import {fileURLToPath} from 'node:url';
import fs, {promises as fsp} from "fs";
import { createRequire } from 'module'
import {arrayify} from "./js-util.js";

const require = createRequire(import.meta.url)

//This is for version 4, but it doesn't work.
//import tailwind from "@tailwindcss/postcss";

let TAILWIND_CSS_DIRECTIVES=`
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

export async function tailwindBuild({cwd, config, out}) {
	let configModule=await import(config).then(m=>m.default);
	configModule.content=arrayify(configModule.content).map(p=>path.resolve(cwd,p));

    let tailwindPlugin=tailwind({...configModule});
    let processor=postcss([tailwindPlugin,autoprefixer]);
    let artifact=await processor.process(TAILWIND_CSS_DIRECTIVES, { from: undefined });

    await fsp.mkdir(path.dirname(out),{recursive: true});
    await fsp.writeFile(out,artifact.css);

	//console.log("Tailwind done...");
}

