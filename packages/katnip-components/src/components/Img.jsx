import {useIsoContext} from "isoq";
//import {useExpr, useCheckExpr} from "../nocode/var.jsx";
import {useVarExpr} from "../nocode/expr.jsx";

export default function Img({src, ...props}) {
	let iso=useIsoContext();
	let srcVar=useVarExpr(src);
	let srcVal=srcVar.get();
	if (srcVal)
		srcVal=iso.getAppUrl(srcVal);

	return (
		<img src={srcVal} {...props}/>
	);
}

Img.editorPreview=({src, ...props})=>{
	let iso=useIsoContext();
	let srcVal=src;
	if (srcVal && srcVal.includes("$"))
		srcVal="/projects_placeholder.png";

	else if (srcVal)
		srcVal=iso.getAppUrl(srcVal);

	else
		srcVal="/projects_placeholder.png";

	return (
		<img src={srcVal} {...props}/>
	);
}

Img.styling=true;
Img.category="Layout";
Img.materialSymbol="image";
Img.controls={
	src: {type: "image"}
};
