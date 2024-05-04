import * as txml from "txml/txml";
//import fs from "fs";

export function cjsxLoader({components, fs}) {
	return {
		name: "cjsx-loader",
		setup: (build)=>{
			build.onLoad({filter: /.*\.cjsx$/}, async args=>{
				let text=await fs.promises.readFile(args.path,"utf8");
				let xml=txml.parse(text);
				let xmlRoot=xml[0];
				let source="";

				for (let component of components)
					source+=`import {${component.name}} from "${component.import}";\n`;

				source+="let F=()=><>"+txml.stringify(xmlRoot.children)+"</>;\n";
				source+=`F.type=${JSON.stringify(xmlRoot.tagName)};\n`;
				for (let k in xmlRoot.attributes)
					source+=`F.${k}=${JSON.stringify(xmlRoot.attributes[k])};\n`
				source+="export default F;";

				//console.log(source);

				return {
					contents: source,
					loader: "jsx"
				};
			})
		}
	}
};
