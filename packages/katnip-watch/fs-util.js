import path from "path";
import {minimatch} from "minimatch";
import {objectifyArgs} from "katnip";
import chokidar from "chokidar";

export function awaitEvent(...args) {
	let argsObj=objectifyArgs(args,["eventTarget", "type", "predicate"]);
	let {eventTarget, type, predicate, error}=argsObj;

	return new Promise((resolve, reject)=>{
		function messageHandler(message) {
			if (!predicate || predicate(message)) {
				if (error)
					eventTarget.removeEventListener(error,errorHandler);

				resolve(message);
			}
		}

		function errorHandler(e) {
			eventTarget.removeEventListener(type,messageHandler);
			if (error)
				eventTarget.removeEventListener(error,errorHandler);

			reject(e);
		}

		eventTarget.addEventListener(type,messageHandler);
		if (error)
			eventTarget.addEventListener(error,errorHandler);
	});
}

export function arrayify(a) {
	if (Array.isArray(a))
		return a;

	if (a===undefined)
		return [];

	return [a];
}

function minimatchAny(fn, patterns, options={}) {
	if (!patterns)
		return false;

	for (let pattern of patterns) {
		if (options.baseDir)
			pattern=path.resolve(options.baseDir,pattern);

		if (minimatch(fn,pattern,options))
			return true;
	}

	return false;
}

export function createWatch(...args) {
	let objArgs=objectifyArgs(args,["pathname","patterns","ignore"]);
	let {pathname, patterns, ignore, fs, method}=objArgs;
	let watcher=new EventTarget();
	let realpathname=fs.realpathSync(pathname);

	patterns=arrayify(patterns).map(p=>path.join(realpathname,p));
	ignore=arrayify(ignore).map(p=>path.join(realpathname,p));
	for (let i of [...ignore])
		ignore.push(i+"/**");

	function handleChange(eventType, filename) {
		//console.log("change handler: "+filename);

		try {
			let fn=path.join(realpathname,filename);
			if ((!patterns.length || minimatchAny(fn,patterns)) &&
					!minimatchAny(fn,ignore,{dot: true})) {
				//console.log("file change: "+filename);

				let newEv=new Event("change");
				newEv.eventType=eventType;
				newEv.filename=filename;
				watcher.dispatchEvent(newEv);
			}
		}

		catch (e) {
			console.log("**** error in watch handler");
			console.log(e);
		}
	}

	let internalWatcher;
	switch (method) {
		case "fs":
		case undefined:
			internalWatcher=fs.watch(realpathname,{recursive: true});
			internalWatcher.on("change",(eventType, filename)=>{
				handleChange(eventType,filename);
			});
			break;

		case "chokidar":
			internalWatcher=chokidar.watch(realpathname,{
				ignored: fn=>{
					//console.log("i?"+fn);

					let relfn=path.relative(realpathname,fn);
					return minimatchAny(fn,ignore,{dot: true});
				}
			});
			internalWatcher.on("change",(filename)=>{
				//console.log("c: "+filename);
				filename=path.relative(realpathname,filename);
				handleChange("change",filename);
			});
			break;

		default:
			throw new Error("Unknown watch method: "+method);
			break;
	}

	watcher.close=()=>internalWatcher.close();

	return watcher;
}
