import path from "path";
import {fileURLToPath} from 'url';
import {DeclaredError, findNodeBin, resolveHookEntryPoints, runCommand} from "katnip";
import fs from "fs";
import postcss from 'postcss';
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

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

/*export async function build(ev) {
    console.log("Building tailwind...");
    let tailwind=await findNodeBin(process.cwd(),"tailwind");
    if (!tailwind)
        throw new Error("Can't find tailwind binary");

    let inputCss="";
    if (ev.options.cssDirectives!==false)
        inputCss+=TAILWIND_CSS_DIRECTIVES;

    if (ev.options.css)
        inputCss+=fs.readFileSync(ev.options.css,"utf8");

    fs.mkdirSync(path.join(ev.cwd,".target"),{recursive: true});
    let inputFn=path.join(ev.cwd,".target/input.css");
    fs.writeFileSync(inputFn,inputCss);

    let outputFn=path.join(ev.cwd,".target/index.css");
    if (ev.options.publicDir)
        outputFn=path.join(ev.options.publicDir,"index.css");

    await runCommand(tailwind,[
//        "--minify",
        "-i",inputFn,
        "-o",outputFn,
//        "--no-autoprefixer"
    ],{passthrough: true});

    if (!ev.options.publicDir || ev.options.exposeIndexCss)
        ev.data.indexCss=await ev.fs.promises.readFile(outputFn,"utf8");
}*/

export async function build(ev) {
    console.log("Building tailwind via postcss...");
    let inputCss="";
    if (ev.options.cssDirectives!==false)
        inputCss+=TAILWIND_CSS_DIRECTIVES;

    if (ev.options.css)
        inputCss+=fs.readFileSync(ev.options.css,"utf8");

    //console.log(inputCss);

    let tailwindcssPlugin=tailwind(path.join(ev.cwd,"tailwind.config.js"));
    let processor=postcss([tailwindcssPlugin,autoprefixer]);
    let artifact=await processor.process(inputCss, { from: undefined });
    let output=artifact.css;

    if (ev.options.publicDir) {
        fs.mkdirSync(path.join(ev.cwd,ev.options.publicDir),{recursive: true});
        let outputFn=path.join(ev.cwd,ev.options.publicDir,"index.css");
        fs.writeFileSync(outputFn,output);
    }

    if (!ev.options.publicDir || ev.options.exposeIndexCss)
        ev.data.indexCss=output;
}
