import {readPackageUp} from 'read-package-up';
import {DeclaredError, objectifyArgs} from "../utils/js-util.js";
import path from "node:path";
import findNodeModules from "find-node-modules";
import fs, {promises as fsp} from "node:fs";

export async function getPackageVersion(cwd) {
    let pkgInfo=await readPackageUp({cwd});
    return pkgInfo.packageJson.version;
}

export async function getEffectiveCwd(cwd, {allowUninitialized}={}) {
    let packageInfo=await readPackageUp({cwd: cwd});
    if (!packageInfo) {
        if (!allowUninitialized)
            throw new DeclaredError("No package.json found.");

        return cwd;
    }

    return path.dirname(packageInfo.path);
}

export function findNodeBin(...args) {
	let {cwd, name, includeProcessCwd}=objectifyArgs(args,["cwd","name","includeProcessCwd"]);

	if (includeProcessCwd===undefined)
		includeProcessCwd=true;

	let dirs=findNodeModules({cwd: cwd, relative: false});
	if (includeProcessCwd)
		dirs=[...dirs,...findNodeModules({cwd: process.cwd(), relative: false})];

	for (let dir of dirs) {
		let fn=path.join(dir,".bin",name);
		if (fs.existsSync(fn))
			return fn;
	}

	throw new Error("Can't find binary: "+name);
}
