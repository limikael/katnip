import KatnipCli from "../../src/cli/KatnipCli.js";
import path from "path";

describe("hello-quickmin",()=>{
	it("works",async ()=>{
		let katnipCli=new KatnipCli({
			argv: ["node","katnip","dev"],
			cwd: path.join(process.cwd(),"examples/hello-quickmin/"),
		});

		await katnipCli.run();

		let response=await fetch("http://localhost:3000/");
		let result=await response.text();

		expect(result).toContain("page titles: hello");

		await katnipCli.stop();
	});
});