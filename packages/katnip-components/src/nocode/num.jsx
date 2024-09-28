import {VarState, useVar, useExpr} from "./var.jsx";
import {Env, useEnv} from "./env.jsx";

export function NumActions({var: varName, children, display, min, max, maxExclusive}) {
	let varState=useVar(varName);
	let env=useEnv();

	if (!display)
		display="block";

	function safeGet() {
		let num=Number(varState.get());
		if (isNaN(num))
			num=0;

		return num;
	}

	function safeSet(v) {
		let minVal=0;
		/*if (min)
			minVal=env.getVar(min).get();*/

		if (v<minVal)
			v=minVal;

		let maxVal;
		if (max)
			maxVal=env.getVar(max).get();

		if (maxExclusive)
			maxVal=env.getVar(maxExclusive).get()-1;

		if (!isNaN(maxVal) && v>maxVal)
			v=maxVal;

		varState.set(v);
	}

	function createVarStates() {
		let varStates={
			increase: new VarState({
				type: "action",
				action: ()=>{
					//console.log("increasing");
					safeSet(safeGet()+1);
				}
			}),

			decrease: new VarState({
				type: "action",
				action: ()=>{
					safeSet(safeGet()-1);
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
