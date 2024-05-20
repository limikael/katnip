import {useVal, useExpr} from "./var.jsx";
import {useEnv} from "./env.jsx";

function LiveVal({expr, Element, ...props}) {
	let val=useExpr(expr);
	if (!Element)
		Element="span";

	return <Element {...props}>{val}</Element>;
}

export function Val({renderMode, expr, children, ...props}) {
	switch (renderMode) {
		case "editor":
			return (<>
				{expr}
			</>);
			break;

		default:
			return (
				<LiveVal expr={expr} {...props}>
					{children}
				</LiveVal>
			);
			break;
	}
}

Val.controls={
	expr: {}
}
