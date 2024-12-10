import {spawn} from "child_process";
import findNodeModules from "find-node-modules";
import path from "path";
import fs from "fs";
import semver from "semver";
import {Worker} from "worker_threads";
import {DeclaredError, objectifyArgs} from "./js-util.js";

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