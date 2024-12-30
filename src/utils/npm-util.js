import path from "path";
import {objectifyArgs, arrayUnique, arrayFindDuplicate, splitPath} from "./js-util.js";
import * as resolve from 'resolve.exports';

export async function resolveModuleEntryPoint(...args) {
	let {cwd,importPath,conditions,fs,pkg}=
		objectifyArgs(args,["cwd","importPath","conditions"]);

	if (!conditions)
		conditions=[];

	if (!pkg) {
		let pkgJson=await fs.promises.readFile(path.join(cwd,"package.json"));
		pkg=JSON.parse(pkgJson);
	}

	//console.log("resolving: "+importPath+" cond:",conditions,"in:"+cwd);

	// todo, don't crash if id doesn't exist
	try {
		let exported=resolve.exports(pkg,importPath,{
			conditions: conditions, 
			unsafe: true
		});

		//console.log(exported);

		if (!exported)
			return;

		if (exported.length!=1)
			throw new Error("Expected exactly one path");

		return exported[0];
	}

	catch (e) {
		//console.log(e);
		if (e.message.startsWith("No known conditions"))
			return;

		if (e.message.startsWith("Missing"))
			return;

		throw e;
	}
}

export async function resolveModuleDir(cwd, packageName, {fs}) {
	if (!path.isAbsolute(cwd))
		throw new Error("resolveModuleDir: Path is not absolute: "+cwd);

	let cand=path.join(cwd,"node_modules",packageName);
	if (fs.existsSync(cand)) {
		if (fs.promises.realpath)
			cand=await fs.promises.realpath(cand);

		return cand;
	}

	if (path.dirname(cwd)==cwd)
		throw new Error("Package not found: "+packageName);

	return await resolveModuleDir(path.dirname(cwd),packageName,{fs});
}

export async function findKeywordDependencies(...args) {
	let {cwd,keyword,dependenciesKey,fs,found,pkg,devDependencies}=
		objectifyArgs(args,["cwd","keyword"]);

	//console.log("finding: "+cwd);

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

	if ((devDependencies || devDependencies===undefined) &&
			pkg.devDependencies)
		dependencies={...dependencies,...pkg.devDependencies};

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
					pkg: dependencyPkg,
					devDependencies: false
				}));
			}
		}
	}

	// Not 100% sure why needed.
	res=arrayUnique(res);

	let pluginNames=res.map(dir=>path.basename(dir));
	if (arrayFindDuplicate(pluginNames)) {
		let duplicate=arrayFindDuplicate(pluginNames);
		let dupPaths=res.filter(dir=>path.basename(dir)==duplicate);
		throw new Error("Multiple instances of plugin: "+arrayFindDuplicate(pluginNames)+" "+JSON.stringify(dupPaths));
	}

	return res;
}

export async function resolveHookEntryPoints(...args) {
	let {cwd,importPath,conditions,keyword,dependenciesKey,fs,dontResolve}=
		objectifyArgs(args,["cwd","importPath","conditions"]);

	if (!dontResolve)
		dontResolve=[];

	if (!keyword)
		throw new Error("Keyword missing for resolveHookEntryPoints");

	let pkgJson=await fs.promises.readFile(path.join(cwd,"package.json"));
	//console.log("parsing pkg in",cwd,pkgJson);
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

	//console.log(keywordDeps);

	for (let keywordDep of keywordDeps) {
		let ep=await resolveModuleEntryPoint(keywordDep,importPath,conditions,{fs});
		if (ep) {
			let shouldResolve=true;
			let keywordDepParts=splitPath(keywordDep);
			let packageName=keywordDepParts[keywordDepParts.length-1];
			for (let d of dontResolve) {
				let dontResolveParts=splitPath(d);
				if (dontResolveParts[0]==packageName &&
						dontResolveParts[1]==importPath)
					shouldResolve=false;
			}

			if (shouldResolve) {
				entryPoints.push(path.join(keywordDep,ep));
			}

			else {
				entryPoints.push(path.join(packageName,importPath));
			}
		}
	}

	return entryPoints;
}

export function pkgSetExport(exps, {importPath, conditions, target}={}) {
	if (!exps)
		exps={};

	if (!conditions)
		conditions=[];

	if (conditions.length)
		throw new Error("Can't handle conditions yet");

	if (!importPath.startsWith("."))
		importPath="./"+importPath;

	if (!target.startsWith("."))
		target="./"+target;

	if (!Object.keys(exps)[0] ||
			Object.keys(exps)[0].startsWith(".")) {
		exps[importPath]=target;
		return exps;
	}

	if (!exps.default)
		exps.default={};

	exps.default[importPath]=target;
	return exps;
}
