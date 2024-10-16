import * as isoqRouter from "isoq-router";
import {useVarExpr} from "../nocode/expr.jsx";

export default function Link({children, href, ...props}) {
	let hrefVar=useVarExpr(href);

	return (
		<isoqRouter.Link href={hrefVar.get()} {...props}>
			{children}
		</isoqRouter.Link>
	);
}

Link.editorPreview=({children, onClick, onclick, href, ...props})=>{
	return <a {...props}>{children}</a>
}

Link.containerType="children";
Link.styling=true;
Link.category="Layout";
Link.icon = {
	type: "material",
	symbol: "add_link"
}
Link.defaultProps={class: "min-h-4 min-w-4"};
Link.controls={
	href: {type: "text"}
};
