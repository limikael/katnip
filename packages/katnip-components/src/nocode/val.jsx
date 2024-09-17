import {useVal, useVar, useExpr} from "./var.jsx";
import {useEnv} from "./env.jsx";
import {useIsoContext} from "isoq";
import urlJoin  from "url-join";

export function Val({expr, Element, ...props}) {
	let iso=useIsoContext();
	let varState=useVar(expr);
	/*if (!Element)
		Element="span";*/

	if (!varState)
		return;

	let val=varState.get();

	switch (varState.type) {
		case "richtext":
			return (
				<div dangerouslySetInnerHTML={{__html: val}} {...props}/>
		    );
			break;

		case "text":
		default:
			return (
				<span {...props}>{val}</span>
			);
			break;
	}
}

Val.editorPreview=props=><span {...props}>{props.expr}</span>;
Val.styling=true;
Val.category="Interaction";
Val.controls={
	expr: {type: ["text","richtext"], expr: true}
}
Val.displayName = "TextValue";
Val.materialSymbol="match_word";

export function ValInput({var: varName, ...props}) {
	let varState=useVar(varName);

	return (
		<input {...props}
				value={varState.get()}
				onChange={ev=>varState.set(ev.target.value)}/>
	);
}

ValInput.editorPreview=props=><input {...props} value={"$"+props.var}/>;
ValInput.category="Interaction";
ValInput.styling=true;
ValInput.controls={
	var: {}
}
ValInput.displayName = "Input"
ValInput.icon = {
	type: "material",
	symbol: "text_select_move_forward_character"
}