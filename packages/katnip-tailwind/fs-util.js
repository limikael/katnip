import {minimatch} from "minimatch";
import path from "path-browserify";

export async function exists(fsPromises, path) {
	try {
		let stat=await fsPromises.stat(path);
		return true;
	} 

	catch (e) {
		if (e.code!="ENOENT")
			throw e;

		return false;
	}
}

export async function mkdirRecursive(fsPromises, dir) {	
	let start="";
	if (path.isAbsolute(dir))
		start=path.sep;

	let parts=dir.split(path.sep);
	for (let i=0; i<=parts.length; i++) {
		let p=path.join(start,...parts.slice(0,i));
		if (!(await exists(fsPromises,p))) {
			try {
				await fsPromises.mkdir(p);
			}

			catch (e) {
				if (e.code!="EEXIST")
					throw e;
			}
		}
	}
}

function minimatchAny(fn, patterns, options={}) {
	for (let pattern of patterns) {
		if (options.baseDir)
			pattern=path.resolve(options.baseDir,pattern);

		if (minimatch(fn,pattern,options))
			return true;
	}

	return false;
}

export async function findMatchingFiles(fsPromises, baseDir, patterns, subDir="") {
	let res=[];

	if (!path.isAbsolute(baseDir))
		throw new Error("Not absolute: "+baseDir);

	let scanDir=path.resolve(baseDir,subDir);
	for (let sub of await fsPromises.readdir(scanDir)) {
		let resolvedSub=path.resolve(scanDir,sub);
		let stat=await fsPromises.stat(resolvedSub)

		if (stat.isDirectory()) {
			if (minimatchAny(resolvedSub,patterns,{
					baseDir:baseDir,
					partial:true}))
				res.push(...await findMatchingFiles(fsPromises,baseDir,patterns,path.join(subDir,sub)));
		}

		else {
			if (minimatchAny(resolvedSub,patterns,{baseDir:baseDir}))
				res.push(path.join(subDir,sub));
		}
	}

	return res;
}