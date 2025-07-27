import fs, {promises as fsp} from "fs";
import resolvePackagePath from "resolve-package-path";
import {resolveImport, resolveAllExports} from "resolve-import";

export async function resolveDependencies(pkgJsonPath) {
	let pkg=JSON.parse(await fsp.readFile(pkgJsonPath));
	let dependencies=pkg.dependencies;
	if (!dependencies)
		dependencies={};

	let depNames=Object.keys(dependencies);
	let res={};

	for (let depName of depNames) {
		let depPath=resolvePackagePath(depName,pkgJsonPath.toString());
		if (!depPath)
			throw new Error("Unable to find dependency: "+depName);

		res[depName]=depPath;
	}

	return res;
}
