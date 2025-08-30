import KatnipServer from "../../src/main/KatnipServer.js";
/*import path from "node:path";
import {fileURLToPath} from 'url';
import fs, {promises as fsp} from "fs";*/

describe("KatnipServer",()=>{
	it("can handle a request",async ()=>{
		let mod={
			async fetch({request, env, fs, imports}) {
				return new Response("hello");
			}
		};

		let env={};
		let server=new KatnipServer({modules: [mod],env});

		let request=new Request("http://hello.world");
		let response=await server.handleRequest({request: request});

		expect(await response.text()).toEqual("hello");
	});

	it("has a local fetch",async ()=>{
		let mod={
			async fetch({request, env, localFetch}) {
				let url=new URL(request.url);

				//console.log(url.pathname);
				if (url.pathname=="/testlocal") {
					return await localFetch("/hello");
				}

				return new Response("hello");
			}
		};

		let env={};
		let imports={};
		let fileContent={};
		let server=new KatnipServer({modules: [mod],env});

		let request=new Request("http://test.com/testlocal");
		let response=await server.handleRequest({request: request});

		expect(await response.text()).toEqual("hello");
	});

	it("runs start",async ()=>{
		let mod={
			async start({env}) {
				env.setonstart=123;
			},

			async fetch({env, fs}) {
				return new Response("hello: "+env.setonstart);
			}
		};

		let server=new KatnipServer({
			modules: [mod],
			env: {},
		});

		let response=await server.handleRequest({request: new Request("http://test")});
		expect(await response.text()).toEqual("hello: 123");
	});

	it("handles errors",async ()=>{
		let mod={
			async fetch({request, env}) {
				throw new Error("This is an error");
			}
		};

		let server=new KatnipServer({
			modules: [mod],
			env: {},
		});

		let response=await server.handleRequest({request: new Request("http://test/handle2")});
		expect(await response.text()).toEqual("This is an error");
		expect(response.status).toEqual(500);
	});

	it("handles scheduled",async ()=>{
		let mod={
			async scheduled({cron, env}) {
				env.didrun=true;
			}
		};

		let server=new KatnipServer({
			modules: [mod],
			env: {},
		});

		await server.handleScheduled({cron: "* * * * *"});
		expect(server.env.didrun).toEqual(true);
	});
});