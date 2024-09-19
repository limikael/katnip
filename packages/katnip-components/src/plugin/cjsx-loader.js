//import * as txml from "txml/txml";
import {txmlParse, txmlStringify} from "../utils/txml-stringify.js";
import path from "path-browserify";

function processCjsxNode(node) {
	if (typeof node=="string")
		return;

	if (node.tagName.charAt(0)==node.tagName.charAt(0).toUpperCase())
		node.tagName="components."+node.tagName;

	for (let c of node.children)
		processCjsxNode(c);
}

export function cjsxLoader({componentsImport, fs}) {
	return {
		name: "cjsx-loader",
		setup: (build)=>{
			build.onLoad({filter: /.*\.cjsx$/}, async args=>{
				let text=await fs.promises.readFile(args.path,"utf8");
				let xml=txmlParse(text);
				let xmlRoot=xml[0];
				let source="";

				source+=`import * as components from "${componentsImport}"\n`;
				for (let c of xmlRoot.children)
					processCjsxNode(c);

				source+="let F=()=><>"+txmlStringify(xmlRoot.children)+"</>;\n";
				source+=`F.type=${JSON.stringify(xmlRoot.tagName)};\n`;
				source+=`F.componentName=${JSON.stringify(path.basename(args.path,".cjsx"))};\n`;
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
