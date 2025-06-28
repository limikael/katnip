import {tailwindBuild} from "../../src/utils/tailwind-util.js";
import path from "node:path";
import {fileURLToPath} from 'node:url';
import fs, {promises as fsp} from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("tailwind-util",()=>{
	it("can compile tailwind",async ()=>{
		await fsp.rm(path.join(__dirname,"tmp"),{recursive: true, force: true});

		await tailwindBuild({
			cwd: path.join(__dirname,"data"),
			config: path.join(__dirname,"data/tailwind.config.cjs"),
			out: path.join(__dirname,"tmp/index.css")
		});

		let res=await fsp.readFile(path.join(__dirname,"tmp/index.css"),"utf8");
		expect(res).toContain("p-5");
	});
})