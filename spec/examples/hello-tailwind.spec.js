import KatnipCli from "../../src/cli/KatnipCli.js";
import path from "path";

describe("hello-tailwind",()=>{
	it("works",async ()=>{
		let katnipCli=new KatnipCli({
			argv: ["node","katnip","dev","--watch=none"],
			cwd: path.join(process.cwd(),"examples/hello-tailwind/"),
		});

		await katnipCli.run();

		let cssResponse=await fetch("http://localhost:3000/index.css");
		let cssResult=await cssResponse.text();

		expect(cssResult).toContain("text-slate");

		let response=await fetch("http://localhost:3000/");
		let result=await response.text();

		expect(result).toContain('<link href="http://localhost:3000/index.css" rel="stylesheet"/>');
		expect(result).toContain('testing tailwind');

		await katnipCli.stop();
	});
});