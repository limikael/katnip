import {cjsxLoader} from "./cjsx-loader.js";
import path from "path-browserify";
import {importUrlGetDirname, mkdirRecursive, rmRecursive} from "katnip";
import {resolveHookEntryPoints} from "katnip";

const __dirname=importUrlGetDirname(import.meta.url);

async function createEntryPointSource(ev) {
    let pageFiles=await ev.fs.promises.readdir(path.join(ev.cwd,"pages"));
    let imports=Object.fromEntries(pageFiles.map(pageFile=>{
        let pageName=pageFile.replace(".cjsx","");
        let pagePath=path.join(ev.cwd,"pages",pageFile);
        return [pageName,pagePath];
    }));

    let importSource="";
    for (let k in imports)
        importSource+=`import ${k} from "${imports[k]}";\n`;

    importSource+=`let CJSX_COMPONENTS=[${Object.keys(imports).join(",")}];\n`

    let source=await ev.fs.promises.readFile(path.join(__dirname,"entrypoint-stub.jsx"),"utf8");
    source=source.replace("$$CJSX_IMPORTS$$",importSource);

    return source;
}

export async function isoqEsbuildPlugins(plugins, ev) {
    let components=[];

    //console.log("************ in the plugin...");

    let componentPaths=await resolveHookEntryPoints(ev.cwd,"katnip-components",{
        fs: ev.fs,
        keyword: "katnip-plugin"
    });

    let allComponentsSource="";
    for (let componentPath of componentPaths)
        allComponentsSource+=`export * from "${componentPath}";\n`;

    let allComponentsFn=path.join(ev.cwd,"node_modules/.katnip/components.jsx");
    await (ev.fs.promises.writeFile(allComponentsFn,allComponentsSource));

    plugins.push(cjsxLoader({
        componentsImport: allComponentsFn,
        fs: ev.fs
    }));
}

/*export async function cjsxComponents(components, ev) {
    components.push({
        name: "Link",
        import: "katnip-components/components"
    });
}*/

export async function build(ev) {
    let source=await createEntryPointSource(ev);
    //console.log(source);
    await mkdirRecursive(path.join(ev.cwd,"node_modules/.katnip"),{fs:ev.fs});
    await ev.fs.promises.writeFile(path.join(ev.cwd,"node_modules/.katnip/main-components.jsx"),source);
    ev.options.isoqEntryPoint=path.join(ev.cwd,"node_modules/.katnip/main-components.jsx");
}