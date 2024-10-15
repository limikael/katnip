import {useVal, useVar, useExpr, useVars} from "./var.jsx";
import {useVarExpr} from "./expr.js";
import {useEnv} from "./env.jsx";
import {useIsoContext} from "isoq";
import urlJoin  from "url-join";

export function Val({expr, Element, ...props}) {
	let iso=useIsoContext();
	let varState=useVarExpr(expr);
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

Val.editorPreview=props=><span {...props}>{props.expr?props.expr:"<value>"}</span>;
Val.styling=true;
Val.category="Logic";
Val.displayName = "TextValue";
Val.materialSymbol="match_word";
Val.controls={
	expr: {type: ["text","richtext"], expr: true}
}

export function ValInput({var: varName, expr, ...props}) {
	if (!expr)
		expr=varName;

	let varState=useVarExpr(expr);
	//let varState=useVar(varName);
	let Element="input";

	if (props.type=="textarea")
		Element="textarea";

	return (
		<Element {...props}
				value={varState.get()}
				onChange={ev=>varState.set(ev.target.value)}/>
	);
}

ValInput.editorPreview=props=><input {...props} value={props.var?props.var:"<input>"}/>;
ValInput.category="Logic";
ValInput.styling=true;
ValInput.displayName = "Input";
ValInput.materialSymbol="text_select_move_forward_character";
ValInput.controls={
	var: {type: "text", expr: true}
}
