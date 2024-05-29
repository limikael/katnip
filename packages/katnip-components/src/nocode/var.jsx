import {Env, useEnv} from "./env.jsx";
import {useEventUpdate, useConstructor} from "../utils/react-util.jsx";
import {jsonClone, arrayUnique} from "../utils/js-util.js";
import {useState, useCallback, useLayoutEffect} from "react";

export class VarState extends EventTarget {
	constructor({value, type, fields, qql}={}) {
		super();
		this.value=value;
		this.type=type;
		this.fields=fields;
		this.qql=qql;
	}

	set(value) {
		if (value===this.value)
			return;

		this.value=value;
		this.dispatchEvent(new Event("change"));
	}

	get() {
		return this.value;
	}
}

export function useVars(varNames) {
	let env=useEnv();
	let [_,setDummyState]=useState();
	let forceUpdate=useCallback(()=>setDummyState({}));

	useLayoutEffect(()=>{
		let currentVarNames=jsonClone(varNames);
		for (let varName of currentVarNames)
			env.getVar(varName).addEventListener("change",forceUpdate);

		return ()=>{
			for (let varName of currentVarNames)
				env.getVar(varName).removeEventListener("change",forceUpdate);
		}
	},[varNames]);

	let vars=[];
	for (let varName of varNames)
		vars.push(env.getVar(varName));

	return vars;
}

export function useVals(varNames) {
	let vars=useVars(varNames);
	return vars.map(v=>v.get());
}

export function useVar(name) {
	let env=useEnv();
	let v;
	if (name)
		v=env.getVar(name);

	useEventUpdate(v,"change");

	return v;
}

export function useVal(name) {
	let v=useVar(name);
	if (!name)
		return;

	return v.get();
}

export function useExpr(expr) {
	if (!expr)
		expr="";

	let matches=expr.match(/\$\w+/g);
	if (!matches)
		matches=[];

	let vars=matches.map(x=>x.replace("$",""));
	let vals=useVals(vars);

	for (let i=0; i<vars.length; i++)
		expr=String(expr).replace("$"+vars[i],vals[i]);

	return expr;
}

export function useExprs(exprs) {
	function extractVarNames(expr) {
		let matches=String(expr).match(/\$\w+/g);
		if (!matches)
			matches=[];

		return matches.map(x=>x.replace("$",""));
	}

	let vars=arrayUnique(exprs.map(extractVarNames).flat());
	let vals=useVals(vars);
	//let valByName=Object.fromEntries(names.map((name,i)=>[name,vals[i]]))

	return exprs.map(expr=>{
		for (let i=0; i<vars.length; i++)
			expr=String(expr).replace("$"+vars[i],vals[i]);

		return expr;
	});

	return exprs;
}

/*export function Var({name, ...props}) {
	let env=useEnv();
	useConstructor(()=>{
		env.addVar(name, new VarState(props));
	})
}*/

/*export function Assign({var: varName, valueVar, transform}) {
	let sourceVar=useVar(valueVar);
	let destVar=useVar(varName);

	let v=sourceVar.get();
	if (transform)
		v=transform(v);

	destVar.set(v);
}*/