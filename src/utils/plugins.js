import fs, {promises as fsp} from "fs";
import path from "path";
import { fileURLToPath , pathToFileURL } from "url";
import { resolve as resolveExports } from "resolve.exports";
import {DeclaredError} from "./js-util.js";

export class PluginEvent {
    constructor(type, extra={}) {
    	this.type=type;
    	Object.assign(this, extra);
    }
}

export class PluginTarget {
    constructor() {
        this.listeners = new Map();
    }

    addEventListener(type, handler) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(handler);
    }

    /*removeEventListener(type, handler) {
        this.listeners.get(type)?.delete(handler);
    }*/

    async dispatch(event) {
        event.target = this;
        const handlers = this.listeners.get(event.type);
        if (!handlers) return;
        for (const handler of handlers) {
            await handler(event);
            //if (event.defaultPrevented) break;
        }
    }
}

export function safeResolveExports(...args) {
	try {
		return resolveExports(...args);
	}

	catch (e) {
		if (e.message.startsWith("No known conditions"))
			return;

		if (e.message.startsWith("Missing"))
			return;

		throw e;
	}
}

export function resolvePackageDir(depName, cwd) {
    let currentDir = cwd;

    while (true) {
        const depPackageJson = path.join(currentDir, "node_modules", depName, "package.json");
        if (fs.existsSync(depPackageJson))
            return path.join(currentDir, "node_modules", depName);

//            return currentDir;

        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            // Reached filesystem root
            return null;
        }
        currentDir = parentDir;
    }
}

export async function loadPlugins({ cwd, keyword, export: exportName }) {
    if (!path.isAbsolute(cwd))
        throw new Error("Need absolue path for loadPlugins!");

    const pkgJsonPath = path.join(cwd, "package.json");
    const rootPkg = JSON.parse(await fsp.readFile(pkgJsonPath, "utf8"));

    const deps = [
        ...Object.keys(rootPkg.dependencies || {}),
        ...Object.keys(rootPkg.devDependencies || {}),
    ];

    const modules=[];

    for (const dep of deps) {
        let depPath=resolvePackageDir(dep,cwd);
        if (!depPath)
            throw new DeclaredError("Missing dependency: "+dep);

        //console.log("dep: "+dep+" dep path: "+depPath);

        let depPkgPath=path.join(depPath,"package.json");
        const depPkg = JSON.parse(await fsp.readFile(depPkgPath, "utf8"));

        if (!depPkg.keywords?.includes(keyword))
        	continue;

        let resolvedEntry=safeResolveExports(depPkg,`./${exportName}`);
        if (!resolvedEntry || !resolvedEntry.length)
            throw new Error("The plugin "+dep+" does not export "+exportName);
            //continue;

        let resolvedFile=path.join(depPath,resolvedEntry[0]);
		modules.push(await import(resolvedFile));
    }

    const target = new PluginTarget();
    for (const mod of modules) {
    	for (let fn in mod) {
    		if (fn!="default") {
	            target.addEventListener(fn,mod[fn]);
    		}
    	}
    }

    return target;
}
