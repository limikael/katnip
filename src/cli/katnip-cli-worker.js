import {createNodeRequestListener} from "serve-fetch";
import {awaitEvent, arrayify} from "../utils/js-util.js";
import HookRunner from "../hooks/HookRunner.js";
import HookEvent from "../hooks/HookEvent.js";
import {resolveHookEntryPoints} from "../utils/npm-util.js";
import http from "http";
import fs from "fs";
import cron from "node-cron";

class DevServer {
	constructor({options, appData, importModules, cwd}) {
		this.options=options;
		this.appData=appData;
		this.importModulesSpec=importModules;
		this.cwd=cwd;
		this.schedule=arrayify(options.schedule);
		this.scheduleTasks=[];
	}

	async start() {
		this.hookRunner=new HookRunner();

		let entryPoints=await resolveHookEntryPoints({
			cwd: this.cwd,
			keyword: "katnip-plugin",
			importPath: "katnip-server-hooks",
			conditions: ["node"],
			fs
		});

		for (let fn of entryPoints)
			this.hookRunner.addListenerModule(await import(fn));

		this.importModules={};
		for (let modName in this.importModulesSpec)
			this.importModules[modName]=await import(this.importModulesSpec[modName]);

		let startEvent=new HookEvent("start",{
			options: this.options,
			importModules: this.importModules,
			appData: this.appData,
			appPathname: "/",
			cwd: this.cwd
		});

		await this.hookRunner.dispatch(startEvent);

		for (let schedule of this.schedule) {
			console.log("Schedule task: "+schedule);
			let task=cron.schedule(schedule,async ()=>{
				await this.triggerSchedule(schedule);
			});

			this.scheduleTasks.push(task);
		}

		let listener=createNodeRequestListener(this.handleFetch);
		this.server=http.createServer(listener);
		this.server.listen(this.options.port);
		await awaitEvent(this.server,"listening",{error: "error"});

		console.log("Server started on port: "+this.options.port);
	}

	async triggerSchedule(cron) {
		console.log("**** Trigger schedule: "+cron);

		let scheduledEvent=new HookEvent("scheduled",{
			cron: "* * * * *",
			scheduledTime: Date.now(),
			options: this.options,
			importModules: this.importModules,
			appData: this.appData,
			appPathname: "/",
			cwd: this.cwd
		});

		await this.hookRunner.dispatch(scheduledEvent);
	}

	handleFetch=async (request)=>{
		let u=new URL(request.url);
		if (u.pathname=="/__scheduled/" || u.pathname=="/__scheduled") {
			try {
				await this.triggerSchedule(u.searchParams.get("cron"));
				return new Response("OK.");
			}

			catch (e) {
				console.log("Scheduled handler error: ",e);
				return new Response(e.message,{status: 500});
			}
		}

		else {
			let fetchEvent=new HookEvent("fetch",{
				request: request,
				options: this.options,
				importModules: this.importModules,
				appData: this.appData,
				localFetch: this.handleFetch,
				appPathname: "/",
				cwd: this.cwd
			});

			try {
				let response=await this.hookRunner.dispatch(fetchEvent);
				if (response)
					return response;

				return new Response("Not found.",{status: 404});
			}

			catch (e) {
				console.log("Fetch handler error: ",e);
				return new Response(e.message,{status: 500});
			}
		}
	}

	async stop() {
		for (let task of this.scheduleTasks)
			task.stop();

		this.scheduleTasks=[];

		this.server.closeAllConnections();
		this.server.close();
		await awaitEvent(this.server,"close",{error: "error"});
	}
}

let devServer;

export async function start({options, appData, importModules, cwd}) {
	devServer=new DevServer({options, appData, importModules, cwd});
	await devServer.start();
}

export async function stop() {
	await devServer.stop();
}