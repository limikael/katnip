import path from "path";
import http from "http";
import HookRunner from "../hooks/HookRunner.js";
import HookEvent from "../hooks/HookEvent.js";
import {parentPort, workerData} from "worker_threads";
import {ResolvablePromise} from "../utils/js-util.js";
import {resolveHookEntryPoints} from "../utils/npm-util.js";
import {createNodeRequestListener} from "serve-fetch";
import fs from "fs";

let hookRunner=new HookRunner();
let entryPoints=await resolveHookEntryPoints({
	cwd: process.cwd(),
	keyword: "katnip-plugin",
	importPath: "katnip-server-hooks",
	conditions: ["node"],
	fs
});

for (let fn of entryPoints)
	hookRunner.addListenerModule(await import(fn));

let fetchEvent={};
fetchEvent.importModules={};
fetchEvent.options=workerData.options;
fetchEvent.data=workerData.data;
fetchEvent.hookRunner=hookRunner;

for (let k in workerData.importModules) {
	if (!path.isAbsolute(workerData.importModules[k]))
		throw new Error("Import module must be absolute: "+workerData.importModules[k]);

	fetchEvent.importModules[k]=await import(workerData.importModules[k]);
}

await hookRunner.emit(new HookEvent("start",fetchEvent));

async function handleFetch(req) {
	if (req.headers.get("x-forwarded-proto")) {
		let forwarded=req.headers.get("x-forwarded-proto");
		let u=new URL(req.url);

		u.protocol=forwarded+":";

		//console.log("forwarded: "+forwarded);
		//console.log("proto: "+u.protocol);
		//console.log(u.toString());

		req=new Request(u.toString(),req);
	}

	let ev={
		req: req, 
		localFetch: handleFetch,
		...fetchEvent
	};

	let response=await hookRunner.emit("fetch",req,ev);
	if (!response)
		response=new Response("Not found.",{status: 404});

	return response;
}

let startedPromise=new ResolvablePromise();

let listener=createNodeRequestListener(handleFetch);
let server=http.createServer(listener);
server.listen(workerData.options.port,(err)=>{
	console.log("**** Listening to port: "+workerData.options.port);
	startedPromise.resolve();
});

parentPort.on("message",async (message)=>{
	switch (message) {
		case "stop":
			let stopPromise=new ResolvablePromise();
			server.close(stopPromise.resolve);
			await stopPromise;
			console.log("Worker done...");
			parentPort.postMessage("stopped");
			break;
	}
});

await startedPromise;

// Flush stdout.
await new Promise(r=>process.stdout.write("",r));
parentPort.postMessage("started");
