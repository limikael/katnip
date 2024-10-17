import {useIsoContext} from "isoq";
import {useVarExprs} from "../nocode/expr.jsx";

export default function Button({action, children, ...props}) {
	if (!action)
		action="";

	let actionArray=action.split(",").map(s=>s.trim()).filter(s=>!!s);
	let actionVars=useVarExprs(actionArray,{assignable: true});

	async function handleClick() {
		let ev=new Event("action",{cancelable: true});
		for (let actionVar of actionVars) {
			if (!ev.defaultPrevented)
				await actionVar.action(ev);
		}
	}

	return (
		<button {...props} onClick={handleClick}>
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
