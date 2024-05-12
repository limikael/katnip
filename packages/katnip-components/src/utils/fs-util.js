import {minimatch} from "minimatch";
import path from "path-browserify";

function minimatchAny(fn, patterns, options={}) {
	for (let pattern of patterns) {
		if (options.baseDir)
			pattern=path.resolve(options.baseDir,pattern);

		if (minimatch(fn,pattern,options))
			return true;
	}

	return false;
}

export async function findMatchingFiles(baseDir, patterns, {fs, subDir}) {
	if (!subDir)
		subDir="";

	let res=[];

	if (!path.isAbsolute(baseDir))
		throw new Error("Not absolute: "+baseDir);

	let scanDir=path.resolve(baseDir,subDir);
	for (let sub of await fs.promises.readdir(scanDir)) {
		let resolvedSub=path.resolve(scanDir,sub);
		let stat=await fs.promises.stat(resolvedSub);

		if (stat.isDirectory()) {
			if (minimatchAny(resolvedSub,patterns,{
					baseDir:baseDir,
					partial:true}))
				res.push(...await findMatchingFiles(baseDir,patterns,{
					fs: fs,
					subDir: path.join(subDir,sub)
				}));
		}

		else {
			if (minimatchAny(resolvedSub,patterns,{baseDir:baseDir}))
				res.push(path.join(subDir,sub));
		}
	}

	return res;
}