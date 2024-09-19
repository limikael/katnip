import {useRef, useContext, createContext} from "react";
import {useEventUpdate, useConstructor} from "../utils/react-util.jsx";
import {VarState} from "./var.jsx";

let EnvContext=createContext();

class EnvState {
	constructor({parent, actions, declarations, varStates, createVarStates, namespace}) {
		this.parent=parent;

		this.namespace=namespace;
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

		if (varStates) {
			for (let k in varStates)
				this.addVar(k,varStates[k]);
		}

		this.actions=actions;
		if (!this.actions)
			this.actions={};

		//console.log("const env, parent",parent);
	}

	getVar(name) {
		name=name.replace("$","");

		if (name.includes(":")) {
			let [namespace,localName]=name.split(":");
			if (namespace==this.namespace &&
					this.variables[localName])
				return this.variables[localName];
		}

		else {
			if (this.variables[name])
				return this.variables[name];
		}

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

	getAction(name) {
		if (this.actions[name])
			return this.actions[name];

		if (this.parent)
			return this.parent.getAction(name);

		throw new Error("Unknown action: "+name);
	}
}

export function useEnv() {
	return useContext(EnvContext);
}

export function Env({actions, varStates, createVarStates, declarations, children, namespace, onChange}) {
	let parent=useEnv();
	let env=useConstructor(()=>new EnvState({actions, varStates, declarations, parent, createVarStates, namespace}));
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
	declarations: {type: "declarations"}
}