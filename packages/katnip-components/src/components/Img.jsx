import {useIsoContext} from "isoq";
import {useExpr} from "../nocode/var.jsx";

export default function Img({src, ...props}) {
	let iso=useIsoContext();
	let srcVal=useExpr(src);

	return (
		<img src={iso.getAppUrl(srcVal)} {...props}/>
	);
}

Img.styling=true;
Img.category="Layout";
Img.materialSymbol="image";
Img.controls={
	src: {type: "text"}
};
