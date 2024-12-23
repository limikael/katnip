import {useRef, useContext, createContext} from "react";
import {useEventUpdate, useConstructor} from "../utils/react-util.jsx";
import {VarState} from "./var.jsx";

let EnvContext=createContext();

class EnvState {
	constructor({parent, actions, declarations, createDeclarations, varStates, createVarStates}) {
		//console.log("creating env", actions);

		this.parent=parent;

		this.variables={};
		if (createVarStates) {
			let varStates=createVarStates();
			for (let k in varStates)
				this.addVar(k,varStates[k]);
		}

		if (declarations) {
			if (typeof declarations=="string")
				declarations=JSON.parse(declarations);

			for (let k in declarations)
				this.addVar(k,new VarState({value: declarations[k]}))
		}

		if (createDeclarations) {
			let createdDeclarations=createDeclarations();
			//console.log(createdDeclarations);
			for (let k in createdDeclarations)
				this.addVar(k,new VarState({value: createdDeclarations[k]}))
		}

		if (varStates) {
			for (let k in varStates)
				this.addVar(k,varStates[k]);
		}

		if (actions) {
			for (let k in actions)
				this.addVar(k,new VarState({action: actions[k]}));
		}
	}

	getVar(name) {
		if (this.variables[name])
			return this.variables[name];

		if (this.parent)
			return this.parent.getVar(name);

		throw new Error("Unknown variable: "+name);
	}

	addVar(name, varState) {
		if (this.variables[name])
			throw new Error("Variable already defined: "+name);

		varState.addEventListener("change",this.handleChange);
		this.variables[name]=varState;
	}

	handleChange=()=>{
		if (this.onChange)
			this.onChange(this);
	}

	/*getAction(name) {
		if (this.actions[name])
			return this.actions[name];

		if (this.parent)
			return this.parent.getAction(name);

		throw new Error("Unknown action: "+name);
	}*/
}

export function useEnv() {
	return useContext(EnvContext);
}

export function Env({actions, varStates, createVarStates, declarations, createDeclarations, children, onChange, display}) {
	if (!display)
		display="block";

	let parent=useEnv();
	let env=useConstructor(()=>new EnvState({actions, varStates, declarations, createDeclarations, parent, createVarStates}));
	env.onChange=onChange;

	return (
		<EnvContext.Provider value={env}>
			{children}
		</EnvContext.Provider>
	)
}

Env.editorPreview=({children})=><div>{children}</div>;
Env.containerType="children";
Env.category="Logic";
Env.materialSymbol="inbox_customize";
Env.defaultProps={display: "block"};
Env.envSpec=({declarations})=>{
	if (typeof declarations=="string")
		declarations=JSON.parse(declarations);

	if (!declarations)
		return;

	let envSpecDeclarations={};
	for (let k in declarations)
		envSpecDeclarations[k]={type: "text"};

	return envSpecDeclarations;
}
Env.controls={
	declarations: {type: "declarations"},
	display: {type: "select", options: ["block","inline-block"]}
}