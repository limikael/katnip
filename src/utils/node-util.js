import {spawn} from "child_process";
import path from "path";
import fs from "fs";
import semver from "semver";
import {DeclaredError, objectifyArgs} from "./js-util.js";
import findNodeModules from "find-node-modules";

/**
 * Run a shell command.
 * 
 * This is a wrapper for the nodejs spawn function.
 * 
 * @async
 * @param command The command to run.
 * @param args Arguments for the command.
 * @param {Object} [options]
 * @param options.passthrough Passthrough data on stdout to the console,
 *                            at the same time as collecting it to be returned.
 * @return The output from the command.
 */
export function runCommand(command, args=[], options={}) {
	const child=spawn(command, args, options);
	let out="";

	//console.log("********** launc");

	let promise=new Promise((resolve,reject)=>{
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

			resolve(out);
		});

		child.on("error",err=>{
			reject(err);
		});
	});

	//console.log("**** launced");
	promise.childProcess=child;

	return promise;
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
