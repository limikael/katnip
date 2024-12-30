import {runCommand} from "../src/utils/node-util.js";

describe("node-util",()=>{
	it("can run a command",async ()=>{
		let out=await runCommand("ls");
		expect(out).toContain("node_modules");
	});
});