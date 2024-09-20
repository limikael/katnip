import {VarState, useVar} from "./var.jsx";
import {Env} from "./env.jsx";

export function NumActions({var: varName, children, display}) {
	let varState=useVar(varName);

	if (!display)
		display="block";

	function safeGet() {
		let num=Number(varState.get());
		if (isNaN(num))
			num=0;

		return num;
	}

	function createVarStates() {
		let varStates={
			increase: new VarState({
				type: "action",
				action: ()=>{
					varState.set(safeGet()+1);
				}
			}),

			decrease: new VarState({
				type: "action",
				action: ()=>{
					varState.set(safeGet()-1);
				}
			}),
		};

		//console.log("created num var states",varStates);

		return varStates;
	}

	return <Env style={{display: display}} createVarStates={createVarStates}>{children}</Env>
}

NumActions.editorPreview=({display, children})=><div style={{display}}>{children}</div>;
NumActions.category="Logic";
NumActions.materialSymbol="123";
NumActions.containerType="children";
NumActions.defaultProps={display: "block"};
NumActions.envSpec=()=>{
	return ({
		"increase": {type: "action"},
		"decrease": {type: "action"}
	});
}
NumActions.controls={
	var: {type: "var"},
	display: {type: "select", options: ["block","inline-block"]}
}
