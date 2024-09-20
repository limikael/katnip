import {useIsoContext} from "isoq";
import {useVar} from "../nocode/var.jsx";

export default function Button({action, children, ...props}) {
	let actionVar=useVar(action);

	return (
		<button {...props} onClick={actionVar.action}>
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
