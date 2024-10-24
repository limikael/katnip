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
	src=iso.useBuilderUrl(src);
/*	let Comp="img";

	if (!src || src.includes("$")) {
		src="/projects_placeholder.png";
	}

	else {
		Comp=iso.BuilderImg;
	}

	return (
		<Comp src={src} {...props}/>
	);*/

	return (
		<img src={src} {...props}/>
	);
}

Img.styling=true;
Img.category="Layout";
Img.materialSymbol="image";
Img.controls={
	src: {type: "image"}
};
