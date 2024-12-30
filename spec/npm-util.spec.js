import {pkgSetExport} from "../src/utils/npm-util.js";

describe("npm-util",()=>{
	it("can add to exports",()=>{
		let after=pkgSetExport(null,{importPath: "katnip-components", target: "src/main/components.jsx"});
		expect(after).toEqual({'./katnip-components': './src/main/components.jsx'});

		let after2=pkgSetExport({"browser": "./bla"},{importPath: "katnip-components", target: "src/main/components.jsx"});
		//console.log(after2);
		expect(after2).toEqual({
			browser: './bla',
			default: { './katnip-components': './src/main/components.jsx' }
		});
	})
});