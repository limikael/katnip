import {spawn} from "child_process";
import findNodeModules from "find-node-modules";
import path from "path";
import fs from "fs";
import semver from "semver";
import {Worker} from "worker_threads";
import {DeclaredError} from "./js-util.js";

export function resolveImport(cand, conditions) {
	if (!path.isAbsolute(cand)) {
		if (fs.existsSync(path.join(process.cwd(),cand)))
			cand=path.join(process.cwd(),cand);

		else if (fs.existsSync(path.join(process.cwd(),"node_modules",cand)))
			cand=path.join(process.cwd(),"node_modules",cand);

		else
			throw new Error("Unable to resolve relative: "+cand);
	}

	if (!fs.existsSync(cand))
		throw new Error("Unable to resolve absolute: "+cand);

	let stat=fs.statSync(cand);
	if (!stat.isDirectory())
		return cand;

	return resolveModuleEntryPoint(cand,conditions);
}

function expandExports(exportDefs) {
	if (typeof exportDefs=="string")
		return [{conditions: [], importPath: ".", path: exportDefs}];

	let res=[];
	for (let k in exportDefs) {
		let childDefs=expandExports(exportDefs[k]);
		for (let def of childDefs)
			if (k.startsWith("."))
				def.import=k;

			else if (k!="default")
				def.conditions.push(k);

		res=[...res,...childDefs];
	}

	return res;
}

function includesAll(a, all) {
	for (let allItem of all)
		if (!a.includes(allItem))
			return false;

	return true;
}

export function resolveModuleEntryPoint(packageDir, conditions=[], args={}) {
	let {importPath, reqConditions}=args;
	if (!importPath)
		importPath=".";

	if (!reqConditions)
		reqConditions=[];

	if (!Array.isArray(reqConditions))
		reqConditions=[reqConditions];

	if (!Array.isArray(conditions))
		conditions=[conditions];

	let packageJsonPath=path.join(packageDir,"package.json");
	let pkgJson=fs.readFileSync(packageJsonPath);
	let pkg=JSON.parse(pkgJson);

	if (pkg.type!="module")
		throw new Error("Expected \"type\": \"module\" in: "+packageJsonPath);

	if (pkg.main && !pkg.exports)
		return path.join(packageDir,pkg.main);

	if (!pkg.exports)
		return;

	for (let exportDef of expandExports(pkg.exports)) {
		if (exportDef.importPath==importPath) {
			if (includesAll(conditions,exportDef.conditions) &&
					includesAll(exportDef.conditions,reqConditions))
				return path.join(packageDir,exportDef.path);
		}
	}
}

export async function runCommand(command, args=[], options={}) {
	const child=spawn(command, args, options);
	let out="";

	await new Promise((resolve,reject)=>{
		if (child.stdout) {
			child.stdout.on('data', (data) => {
				if (options.passthrough)
					process.stdout.write(data);

				out+=data;
			});
		}

		if (child.stderr) {
			child.stderr.on('data', (data) => {
				if (options.passthrough)
					process.stderr.write(data);

				else
					console.log(`stderr: ${data}`);
			});
		}

		child.on('close', (code) => {
			if (code) {
				console.log(out);
				return reject(new Error(command+" exit code: "+code))
			}

			resolve();
		});
	});

	return out;
}

export function findNodeBin(cwd, name) {
	let dirs=findNodeModules({cwd: cwd, relative: false});
	for (let dir of dirs) {
		let fn=path.join(dir,".bin",name);
		if (fs.existsSync(fn))
			return fn;
	}

	throw new Error("Can't find binary: "+name);
}

export function projectNeedInstall(projectDir) {
	let mainPackageJsonPath=path.join(projectDir,"package.json");
	let mainPackageJson=JSON.parse(fs.readFileSync(mainPackageJsonPath,"utf8"));
	for (let depName in mainPackageJson.dependencies) {
		let depPackageJsonPath=path.join(path.join(projectDir,"node_modules",depName,"package.json"));
		if (!fs.existsSync(depPackageJsonPath))
			return true;

		let depPackageJson=JSON.parse(fs.readFileSync(depPackageJsonPath,"utf8"));
		let currentVersion=depPackageJson.version;
		let requiredVersion=mainPackageJson.dependencies[depName];

		if (!semver.satisfies(currentVersion,requiredVersion))
			return true;
	}
}

export function waitForWorker(worker) {
	let messages=[];

	return new Promise((resolve,reject)=>{
		worker.on("exit",(code)=>{
			if (code) {
				let errorMessage=messages[messages.length-1];
				if (!errorMessage)
					reject(new Error("Code: "+code));

				else if (errorMessage.declared)
					reject(new DeclaredError(errorMessage.message));

				else 
					reject(new Error(errorMessage.message));
			}

			else {
				//console.log("resolve");
				resolve(messages[messages.length-1]);
			}
		});

		worker.on("message",(message)=>{
			//console.log("got message: ",message);
			if (message && message.type=="chdir") {
				try {
					let result=process.chdir(message.chdir);
					worker.postMessage({
						type: "result",
						result: result
					});
				}

				catch (e) {
					worker.postMessage({
						type: "error",
						error: String(e),
					});
				}
			}

			else
				messages.push(message);
		});
	})
}

export async function runWorker(workerPath, options) {
	let worker=new Worker(workerPath,options);
	return await waitForWorker(worker);
}

export function workerPortRequest(port, request) {
	return new Promise((resolve, reject)=>{
		function onMessage(message) {
			if (message.type=="result") {
				port.off("message",onMessage);
				resolve(message.result);
			}

			else if (result.type=="error") {
				port.off("message",onMessage);
				reject(message.error);
			}
		}

		port.on("message",onMessage);
		port.postMessage(request);
	});
}