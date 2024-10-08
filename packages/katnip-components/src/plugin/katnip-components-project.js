import {cjsxLoader} from "./cjsx-loader.js";
import path from "path-browserify";
import {importUrlGetDirname, mkdirRecursive, rmRecursive} from "katnip";
import {resolveHookEntryPoints} from "katnip";
import {findMatchingFiles} from "../utils/fs-util.js";
import ENTRYPOINT_STUB_SOURCE from "./entrypoint-stub-source.js";
//const __dirname=importUrlGetDirname(import.meta.url);

export async function initcli(spec) {
    spec.addCommandOption("build","exposeCjsxComponents",{
        description: "Expose CJSX components.",
        type: "boolean",
    });
}

async function makeAllComponentsJsx(ev) {
    let components=[];

    //console.log("making all components");

    let componentPaths=await resolveHookEntryPoints(ev.cwd,"katnip-components",{
        fs: ev.fs,
        keyword: "katnip-plugin"
    });

    //console.log(componentPaths);

    let allComponentsSource="";
    for (let componentPath of componentPaths)
        allComponentsSource+=`export * from "${componentPath}";\n`;

    let filePatters=[
        "pages/**/*.cjsx",
        "blocks/**/*.cjsx"
    ];

    let cjsxFiles=await findMatchingFiles(ev.cwd,filePatters,{fs: ev.fs});

    let imports=Object.fromEntries(cjsxFiles.map(cjsxFile=>{
        let componentName=path.basename(cjsxFile,".cjsx");
        let fullPath=path.join(ev.cwd,cjsxFile);
        return [componentName,fullPath];
    }));

    for (let k in imports)
        allComponentsSource+=`export {default as ${k}} from "${imports[k]}";\n`;

    let allComponentsFn=path.join(ev.cwd,"node_modules/.katnip/components.jsx");
    await (ev.fs.promises.writeFile(allComponentsFn,allComponentsSource));
}

async function createEntryPointSource(ev) {
    let allComponentsFn=path.join(ev.cwd,"node_modules/.katnip/components.jsx");
    let importSource=`import * as CJSX_COMPONENTS from "${allComponentsFn}";\n`;

    if (ev.options.exposeCjsxComponents)
        importSource+=`export * as CJSX_COMPONENTS from "${allComponentsFn}";\n`;

    //let source=await ev.fs.promises.readFile(path.join(__dirname,"entrypoint-stub.jsx"),"utf8");
    let source=ENTRYPOINT_STUB_SOURCE;
    source=source.replace("$$CJSX_IMPORTS$$",importSource);

    let entryPointFn=path.join(ev.cwd,"node_modules/.katnip/main-components.jsx");
    await ev.fs.promises.writeFile(entryPointFn,source);
}

export async function isoqEsbuildPlugins(plugins, ev) {
    plugins.push(cjsxLoader({
        componentsImport: path.join(ev.cwd,"node_modules/.katnip/components.jsx"),
        fs: ev.fs
    }));
}

export async function isoqModules(modules, ev) {
    modules.push(path.join(ev.cwd,"node_modules/.katnip/main-components.jsx"));
}

export async function editorData(editorData, ev) {
    if (!editorData.envSpec)
        editorData.envSpec={};

    if (editorData.quickminConf) {
        let collectionsSpec=JSON.parse(JSON.stringify(editorData.quickminConf.collections));
        for (let k in collectionsSpec)
            collectionsSpec[k].type="collection"

        editorData.envSpec={
            ...editorData.envSpec,
            ...collectionsSpec
        };
    }
}

export async function build(ev) {
    if (ev.options.exposeCjsxComponents)
        ev.options.isoqExposeExports=true;

    await mkdirRecursive(path.join(ev.cwd,"node_modules/.katnip"),{fs:ev.fs});

    await makeAllComponentsJsx(ev);
    await createEntryPointSource(ev);

    //ev.options.isoqEntryPoint=path.join(ev.cwd,"node_modules/.katnip/main-components.jsx");
}

export async function scaffold(ev) {
    ev.isomain=false;
}
