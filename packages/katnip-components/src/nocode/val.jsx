import {useVal, useVar, useExpr} from "./var.jsx";
import {useEnv} from "./env.jsx";
import {withEditorPreview} from "./editor-preview.jsx";

export function Val({expr, Element, ...props}) {
	let val=useExpr(expr);
	if (!Element)
		Element="span";

	return <Element {...props}>{val}</Element>;
}

Val.editorPreview=props=><span {...props}>{props.expr}</span>;
Val.styling=true;
Val.category="Interaction";
Val.controls={
	expr: {}
}
Val.displayName = "TextValue"
Val.icon = {
	type: "material",
	symbol: "match_word"
} 

export function ValRichText({expr, ...props}) {
	let val=useExpr(expr);

	return (
		<div
	  		dangerouslySetInnerHTML={{__html: val}}
	  		{...props}
	    />
	);
}

ValRichText.editorPreview=props=><span {...props}>{props.expr}</span>;
ValRichText.styling=true;
ValRichText.category="Interaction";
ValRichText.controls={
	expr: {}
}
ValRichText.displayName = "RichTextValue"
ValRichText.icon = {
	type: "material",
	symbol: "match_word"
} 

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