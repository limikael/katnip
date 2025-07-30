import {katnipStart} from "katnip";
import path from "node:path";
import {fileURLToPath} from 'node:url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));

describe("katnip-node",()=>{
	it("can serve",async ()=>{
		let server=await katnipStart({
			cwd: path.join(__dirname,"test-project"),
			port: 3000,
			silent: true,
			build: true
		});

		let response=await fetch("http://localhost:3000/hello");
		let result=await response.text();
		expect(result).toEqual("hello world");

		response=await fetch("http://localhost:3000/hello.txt");
		result=await response.text();
		expect(result).toEqual("this is test content");

		await server.stop();
	});
});