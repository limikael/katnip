import KatnipCli from "../../src/cli/KatnipCli.js";
import path from "path";

describe("hello-noplugins",()=>{
	it("works",async ()=>{
		let katnipCli=new KatnipCli({
			argv: ["node","katnip","dev"],
			cwd: path.join(process.cwd(),"examples/hello-noplugins/"),
		});

		await katnipCli.run();

		let response=await fetch("http://localhost:3000/");
		let result=await response.text();

		expect(result).toEqual("hello: http://localhost:3000/");

		await katnipCli.stop();
	});
});