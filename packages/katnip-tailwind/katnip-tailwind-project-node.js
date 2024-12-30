import path from "path";
import {fileURLToPath} from 'url';
import {DeclaredError, resolveHookEntryPoints} from "katnip";
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
    let tailwindConfigFile=path.join(ev.cwd,"tailwind.config.js");
    if (!fs.existsSync(tailwindConfigFile)) {
        console.log("Creating "+tailwindConfigFile);
        fs.writeFileSync(tailwindConfigFile,TAILWIND_CONFIG_JS);
    }
}

/*export function initcli(spec) {
    spec.addCommandOption("build","css","Input css file for tailwind (optional).");
    spec.addCommandOption("build","cssDirectives","Include default tailwind css directives.",{
        type: "boolean",
        default: true
    });
}*/

let TAILWIND_CSS_DIRECTIVES=`
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

export async function build(buildEvent) {
    console.log("Building tailwind via postcss in: "+buildEvent.cwd);
    let inputCss="";
    if (buildEvent.options.cssDirectives!==false)
        inputCss+=TAILWIND_CSS_DIRECTIVES;

    if (buildEvent.options.css)
        inputCss+=fs.readFileSync(buildEvent.options.css,"utf8");

    //console.log(inputCss);

    let oldPwd=process.cwd();
    process.chdir(buildEvent.cwd);

    let tailwindcssPlugin=tailwind(path.join(buildEvent.cwd,"tailwind.config.js"));
    let processor=postcss([tailwindcssPlugin,autoprefixer]);
    let artifact=await processor.process(inputCss, { from: undefined });
    let output=artifact.css;

    process.chdir(oldPwd);

    if (buildEvent.options.publicDir) {
        fs.mkdirSync(path.join(buildEvent.cwd,buildEvent.options.publicDir),{recursive: true});
        let outputFn=path.join(buildEvent.cwd,buildEvent.options.publicDir,"index.css");
        fs.writeFileSync(outputFn,output);
    }

    if (!buildEvent.options.publicDir || buildEvent.options.exposeIndexCss)
        buildEvent.appData.indexCss=output;

    //await new Promise(r=>setTimeout(r,1000));

    console.log("Tailwind done...");
}
