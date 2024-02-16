import path from "path";
import http from "http";
import HookRunner from "../hooks/HookRunner.js";
import HookEvent from "../hooks/HookEvent.js";
import {parentPort, workerData} from "worker_threads";
import {resolveImport} from "../utils/node-util.js";
import {ResolvablePromise} from "../utils/js-util.js";
import {findKatnipModules} from "../cli/find-katnip-modules.js";
import {createNodeRequestListener} from "serve-fetch";

let hookRunner=new HookRunner();
for (let fn of findKatnipModules(["server","node"],{reqConditions: "server"}))
	hookRunner.addListenerModule(await import(fn));

let fetchEvent={};
fetchEvent.importModules={};
fetchEvent.options=workerData.options;
fetchEvent.data=workerData.data;

for (let k in workerData.importModules)
	fetchEvent.importModules[k]=await import(resolveImport(workerData.importModules[k]));

await hookRunner.emit(new HookEvent("start",fetchEvent));

async function handleFetch(req) {
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
	console.log("Listening to port: "+workerData.options.port);
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
parentPort.postMessage("started");
