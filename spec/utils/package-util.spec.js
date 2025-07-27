import {resolveDependencies} from "../../src/utils/package-util.js";

describe("package-util",()=>{
	it("can resolve deps",async ()=>{
		let deps=await resolveDependencies(new URL('../../package.json', import.meta.url));
		//console.log(deps);
	});
});