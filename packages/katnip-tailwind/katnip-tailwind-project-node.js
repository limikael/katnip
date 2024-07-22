import path from "path";
import {fileURLToPath} from 'url';
import {DeclaredError, findNodeBin, resolveHookEntryPoints, runCommand} from "katnip";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TAILWIND_CONFIG_JS=
`module.exports = {
  content: ["./src/**/*.jsx"],
  theme: {
    extend: {
    },
    colors: {
      black: "#000000",
      white: "#ffffff",
    },
  },
}
`;

init.priority=15;
export function init(ev) {
    let tailwindConfigFile="tailwind.config.js";
    if (!fs.existsSync(tailwindConfigFile)) {
        console.log("Creating "+tailwindConfigFile);
        fs.writeFileSync(tailwindConfigFile,TAILWIND_CONFIG_JS);
    }
}

export function initcli(spec) {
    spec.addCommandOption("build","css","Input css file for tailwind (optional).");
    spec.addCommandOption("build","cssDirectives","Include default tailwind css directives.",{
        type: "boolean",
        default: true
    });
}

let TAILWIND_CSS_DIRECTIVES=`
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

export async function build(ev) {
    console.log("Building tailwind...");
    let tailwind=await findNodeBin(process.cwd(),"tailwind");
    if (!tailwind)
        throw new Error("Can't find tailwind binary");

    let inputCss="";
    if (ev.options.cssDirectives!==false)
        inputCss+=TAILWIND_CSS_DIRECTIVES;

    if (ev.options.css)
        inputCss+=fs.readFileSync(ev.options.css,"utf8");

    let inputFn=path.join(ev.cwd,".target/input.css");
    fs.writeFileSync(inputFn,inputCss);

    let outputFn=path.join(ev.cwd,".target/index.css");
    if (ev.options.publicDir)
        outputFn=path.join(ev.options.publicDir,"index.css");

    await runCommand(tailwind,[
        "--minify",
        "-i",inputFn,
        "-o",outputFn
    ],{passthrough: true});

    if (!ev.options.publicDir)
        ev.data.indexCss=await ev.fs.promises.readFile(outputFn,"utf8");
}
