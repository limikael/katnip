import {VarState, useExpr} from "./var.jsx";
import {Env, useEnv} from "./env.jsx";

export function Subscript({children, in: inName, field, var: varName, ...props}) {
	let env=useEnv();

	function createVarStates() {
		let inVar=env.getVar(inName);
		let fieldVal=env.getVar(field).get();
		let varState=new VarState({value: inVar.get()[fieldVal]});
		varState.addEventListener("change",()=>{
			let v=inVar.get();
			v[fieldVal]=varState.get();
			inVar.set(v);
		});

		varName=varName.replace("$","");

		return {
			[varName]: varState
		}
	}

	return (<Env createVarStates={createVarStates}>{children}</Env>);
}

Subscript.editorPreview=({children})=><div>{children}</div>;
Subscript.category="Logic";
Subscript.materialSymbol="subscript";
Subscript.envSpec=(props, envSpec)=>{
	return ({
		[props.var]: {}
	});
}
Subscript.containerType="children";
Subscript.displayName = "Subscript"
Subscript.controls={
	in: {type: "expr"},
	field: {type: "text"},
	var: {type: "expr"},
}
