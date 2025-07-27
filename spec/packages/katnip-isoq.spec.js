import {katnipServe} from "katnip";
import path from "node:path";
import {fileURLToPath} from 'node:url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));

describe("katnip-isoq",()=>{
	it("can serve iso",async ()=>{
		let server=await katnipServe({
			//platform: "node",
			cwd: path.join(__dirname,"test-project"),
			port: 3000
		});

		let response=await fetch("http://localhost:3000/");
		let result=await response.text();
		//console.log(result);

		expect(result).toContain("hello isoq");
		expect(result).toContain(`<div id="isoq"`);

		await server.stop();
	});
});