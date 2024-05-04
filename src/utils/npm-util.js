import {objectifyArgs, includesAll, arrayFindDuplicate} from "./js-util.js";
import path from "path-browserify";
import {exists} from "./fs-util.js";
import semver from "semver";

function expandExports(exportDefs, importPath="", conditions=[]) {
	if (typeof exportDefs=="string") {
		if (importPath=="." || importPath=="./")
			importPath="";

		return [{
			importPath, 
			conditions, 
			path: exportDefs
		}];
	}

	let res=[];
	for (let k in exportDefs) {
		let childImportPath=importPath;
		let childConditions=conditions;

		if (k.startsWith("."))
			childImportPath=path.join(childImportPath,k);

		else if (k!="default")
			childConditions=[...childConditions,k];

		res.push(...expandExports(exportDefs[k],childImportPath,childConditions));
	}

	return res;
}

export async function resolveModuleEntryPoint(...args) {
	let {cwd,importPath,conditions,fs,pkg}=
		objectifyArgs(args,["cwd","importPath","conditions"]);

	if (!conditions)
		conditions=[];

	if (!pkg) {
		let pkgJson=await fs.promises.readFile(path.join(cwd,"package.json"));
		pkg=JSON.parse(pkgJson);
	}

	//console.log("import: "+cwd+" / "+importPath);

	if (!pkg.exports) {
		if (importPath) {
			if (await exists(path.join(cwd,importPath),{fs}))
				return importPath;

			return;
		}

		if (pkg.browser) {
			if (!importPath && pkg.main && pkg.browser[pkg.main])
				return pkg.browser[pkg.main];

			return pkg.browser;
		}

		if (pkg.main)
			return pkg.main;

		if (!importPath &&
				await exists(path.join(cwd,"index.js"),{fs}))
			return "index.js";

		return;
	}

	for (let exportEntry of expandExports(pkg.exports)) {
		//console.log("exportEntry.importPath: "+exportEntry.importPath+" ... "+importPath);
		if (exportEntry.importPath==importPath &&
				includesAll(conditions,exportEntry.conditions))
			return exportEntry.path;
	}
}

export async function resolveModuleDir(cwd, packageName, {fs}) {
	if (!path.isAbsolute(cwd))
		throw new Error("resolveModuleDir: Path is not absolute: "+cwd);

	let cand=path.join(cwd,"node_modules",packageName);
	if (await exists(cand,{fs})) {
		if (fs.promises.realpath)
			cand=await fs.promises.realpath(cand);

		return cand;
	}

	if (path.dirname(cwd)==cwd)
		throw new Error("Package not found: "+packageName);

	return await resolveModuleDir(path.dirname(cwd),packageName,{fs});
}

export async function findKeywordDependencies(...args) {
	let {cwd,keyword,dependenciesKey,fs,found,pkg}=
		objectifyArgs(args,["cwd","keyword"]);

	if (!keyword)
		throw new Error("Keyword missing for findKeywordDependencies");

	if (!found)
		found=[];

	if (!pkg) {
		let pkgJson=await fs.promises.readFile(path.join(cwd,"package.json"));
		pkg=JSON.parse(pkgJson);
	}

	let dependencies=pkg.dependencies;
	if (dependenciesKey && pkg[dependenciesKey])
		dependencies=pkg[dependenciesKey];

	let res=[];
	for (let dependency in dependencies) {
		let dependencyDir=await resolveModuleDir(cwd,dependency,{fs});
		if (!found.includes(dependencyDir)) {
			let dependencyPkgJson=await fs.promises.readFile(path.join(dependencyDir,"package.json"));
			let dependencyPkg=JSON.parse(dependencyPkgJson);

			if (dependencyPkg.keywords && 
					dependencyPkg.keywords.includes(keyword)) {
				res.push(dependencyDir);
				res.push(...await findKeywordDependencies(dependencyDir,keyword,{
					fs,
					dependenciesKey,
					found: [...found,...res],
					pkg: dependencyPkg
				}));
			}
		}
	}

	let pluginNames=res.map(dir=>path.basename(dir));
	if (arrayFindDuplicate(pluginNames))
		throw new Error("Multiple instances of plugin: "+arrayFindDuplicate(pluginNames)+" all="+JSON.stringify(res));

	return res;
}

export async function resolveHookEntryPoints(...args) {
	let {cwd,importPath,conditions,keyword,dependenciesKey,fs}=
		objectifyArgs(args,["cwd","importPath","conditions"]);

	if (!keyword)
		throw new Error("Keyword missing for resolveHookEntryPoints");

	let pkgJson=await fs.promises.readFile(path.join(cwd,"package.json"));
	let pkg=JSON.parse(pkgJson);

	let entryPoints=[];
	let ep=await resolveModuleEntryPoint(cwd,importPath,conditions,{fs,pkg});
	if (ep)
		entryPoints.push(path.join(cwd,ep));

	let keywordDeps=await findKeywordDependencies(cwd,{
		dependenciesKey,
		keyword,
		fs,
		pkg
	});

	for (let keywordDep of keywordDeps) {
		let ep=await resolveModuleEntryPoint(keywordDep,importPath,conditions,{fs});
		if (ep)
			entryPoints.push(path.join(keywordDep,ep));
	}

	return entryPoints;
}

export async function projectNeedInstall(projectDir, {fs}) {
	if (!path.isAbsolute(projectDir))
		throw new Error("Need absolute project path");

	if (await exists(path.join(projectDir,"node_modules",".INCOMPLETE"),{fs})) {
		console.log("return true");
		return true;
	}

	let mainPackageJsonPath=path.join(projectDir,"package.json");
	let mainPackageJson=JSON.parse(await fs.promises.readFile(mainPackageJsonPath,"utf8"));
	for (let depName in mainPackageJson.dependencies) {
		let depPackageJsonPath=path.join(projectDir,"node_modules",depName,"package.json");
		if (!(await exists(depPackageJsonPath,{fs}))) {
			console.log("doesn't exist: "+depPackageJsonPath);
			return true;
		}

		let depPackageJson=JSON.parse(await fs.promises.readFile(depPackageJsonPath,"utf8"));
		let currentVersion=depPackageJson.version;
		let requiredVersion=mainPackageJson.dependencies[depName];

		if (!semver.satisfies(currentVersion,requiredVersion)) {
			console.log("required: "+requiredVersion+" current: "+currentVersion);
			return true;
		}
	}
}
