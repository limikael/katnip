import {Env, useEnv} from "./env.jsx";
import {useEventUpdate, useConstructor} from "../utils/react-util.jsx";
import {jsonClone, arrayUnique} from "../utils/js-util.js";
import {useState, useCallback, useLayoutEffect} from "react";

export class VarState extends EventTarget {
	constructor({value, type, fields, qql, sessionStorageKey, action, collectionId}={}) {
		super();
		this.value=value;
		this.type=type;
		this.fields=fields;
		this.qql=qql;
		this.action=action;
		this.collectionId=collectionId;
		this.sessionStorageKey=sessionStorageKey;

		if (this.action)
			this.type="action";

		if (this.sessionStorageKey && globalThis.sessionStorage)
			this.value=JSON.parse(globalThis.sessionStorage.getItem(this.sessionStorageKey));
	}

	set(value) {
		if (value===this.value)
			return;

		this.value=value;
		if (this.sessionStorageKey && globalThis.sessionStorage)
			globalThis.sessionStorage.setItem(this.sessionStorageKey,JSON.stringify(this.value));

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

/*export function useVals(varNames) {
	let vars=useVars(varNames);
	return vars.map(v=>v.get());
}

export function useVar(name) {
	let env=useEnv();
	let v;
	if (name)
		v=env.getVar(name.replace("$",""));

	useEventUpdate(v,"change");

	return v;
}

export function useVal(name) {
	let v=useVar(name);
	if (!name)
		return;

	return v.get();
}

export function useCheckedExpr(expr) {
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
}*/
