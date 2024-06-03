import * as isoqRouter from "isoq-router";
import {useExpr} from "../nocode/var.jsx";

function LiveLink({children, href, ...props}) {
	let hrefVal=useExpr(href);

	return (
		<isoqRouter.Link href={hrefVal} {...props}>
			{children}
		</isoqRouter.Link>
	);
}

export default function Link({renderMode, children, ...props}) {
	//console.log("renderMode="+renderMode);

	if (!renderMode)
		return (
			<LiveLink {...props}>
				{children}
			</LiveLink>
		);

	props.onClick=null;
	props.onclick=null;
	props.href=null;

	return <a {...props}>{children}</a>
}

Link.styling=true;
Link.category="Interaction";
Link.icon = {
	type: "material",
	symbol: "add_link"
}
Link.controls={
	href: {type: "text"}
};
