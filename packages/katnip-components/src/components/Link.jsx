import * as isoqRouter from "isoq-router";
import {useExpr} from "../nocode/var.jsx";

export default function Link({children, href, ...props}) {
	let hrefVal=useExpr(href);

	return (
		<isoqRouter.Link href={hrefVal} {...props}>
			{children}
		</isoqRouter.Link>
	);
}

Link.editorPreview=({children, onClick, onclick, href, ...props})=>{
	return <a {...props}>{children}</a>
}

Link.containerType="children";
Link.styling=true;
Link.category="Interaction";
Link.icon = {
	type: "material",
	symbol: "add_link"
}
Link.controls={
	href: {type: "text"}
};
