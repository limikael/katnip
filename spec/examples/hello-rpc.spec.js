import KatnipCli from "../../src/cli/KatnipCli.js";
import path from "path";

describe("hello-rpc",()=>{
	it("works",async ()=>{
		let katnipCli=new KatnipCli({
			argv: ["node","katnip","dev"],
			cwd: path.join(process.cwd(),"examples/hello-rpc/"),
		});

		await katnipCli.run();

		let response=await fetch("http://localhost:3000/rpc",{
			method: "POST",
			body: JSON.stringify({method: "hello123", params: []})
		});

		expect(response.status).toEqual(200);

		let result=await response.json();
		expect(result).toEqual({result: 123});

		await katnipCli.stop();
	});

	it("works with isoq",async ()=>{
		let katnipCli=new KatnipCli({
			argv: ["node","katnip","dev"],
			cwd: path.join(process.cwd(),"examples/hello-rpc/"),
		});

		await katnipCli.run();

		let response=await fetch("http://localhost:3000/");
		let result=await response.text();

		expect(result).toContain("val: 123");

		await katnipCli.stop();
	});
});