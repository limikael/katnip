import {useIsoContext} from "isoq";
import {useVarExpr} from "../nocode/expr.jsx";

export default function Button({action, children, ...props}) {
	let actionVar=useVarExpr(action,{assignable: true});

	let fn;
	if (actionVar)
		fn=actionVar.action;

	return (
		<button {...props} onClick={fn}>
			{children}
		</button>
	);
}

Button.styling=true;
Button.editorPreview=({children, ...props})=><button {...props}>{children}</button>;
Button.containerType="children";
Button.category="Logic";
Button.materialSymbol="check_box_outline_blank";
Button.controls={
	action: {type: "action", expr: true}
};
