import KatnipCli from "../../src/cli/KatnipCli.js";
import path from "path";

describe("hello-static",()=>{
	it("works",async ()=>{
		let katnipCli=new KatnipCli({
			argv: ["node","katnip","dev"],
			cwd: path.join(process.cwd(),"examples/hello-static/"),
		});

		await katnipCli.run();

		let response=await fetch("http://localhost:3000/hello.txt");
		let result=await response.text();

		expect(result).toEqual("hello world");

		await katnipCli.stop();
	});
});