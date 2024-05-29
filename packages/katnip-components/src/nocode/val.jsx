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
Val.controls={
	expr: {}
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
ValInput.styling=true;
ValInput.controls={
	var: {}
}
