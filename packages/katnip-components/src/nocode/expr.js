import {VarState, useVars} from "./var.jsx";
import {TemplateLiteralParser} from "./parser.js";
import {arrayUnique} from "../utils/js-util.js";

class SubscriptVarState {
	constructor(varState, subscripts) {
		this.varState=varState;
		this.subscripts=subscripts;
	}

	set(value) {
		let val=this.varState.get();
		for (let subscript of this.subscripts.slice(0,this.subscripts.length-1))
			val=val[subscript];

		let lastSubscript=this.subscripts[this.subscripts.length-1];
		val[lastSubscript]=value;//.set(value);

		this.varState.set(val);
		this.varState.dispatchEvent(new Event("change"));
	}

	get() {
		let val=this.varState.get();

		for (let subscript of this.subscripts)
			val=val[subscript];

		return val;
	}
}

function getAstVarNames(ast) {
	let varNames;

	switch (ast.type) {
		case "expr":
			varNames=[];
			for (let ref of ast.ref)
				varNames.push(...getAstVarNames(ref));

			varNames.push(ast.var);
			return varNames;
			break;

		case "concat":
			varNames=[];
			for (let part of ast.parts)
				varNames.push(...getAstVarNames(part));

			return varNames;
			break;

		case "literal":
			return [];
			break;

		case "field":
			return [];
			break;

		default:
			throw new Error("Unknown ast node for name: "+ast.type);
	}
}

function getAstVar(ast, varsByName) {
	switch (ast.type) {
		case "expr":
			let refVals=ast.ref.map(subAst=>getAstVal(subAst, varsByName));
			if (refVals.length)
				return new SubscriptVarState(varsByName[ast.var],refVals);

			return varsByName[ast.var];
			break;

		case "concat":
			let partValues=ast.parts.map(part=>getAstVal(part, varsByName));
			return new VarState({value: partValues.join("")});

		case "literal":
			return new VarState({value: ast.value});
			break;

		case "field":
			return new VarState({value: ast.name});
			break;

		default:
			throw new Error("Unknown ast node: "+ast.type);
	}
}

function getAstVal(ast, varsByName) {
	return getAstVar(ast,varsByName).get();
}

export function useVarExpr(expr) {
	let tplParser=new TemplateLiteralParser();
	let ast=tplParser.parse(expr);
	let varNames=arrayUnique(getAstVarNames(ast));
	//console.log("var names: "+varNames);
	let vars=useVars(varNames);
	let varsByName=Object.fromEntries(varNames.map((_,i)=>[varNames[i],vars[i]]));
	//console.log(varsByName);

	let varState=getAstVar(ast,varsByName);
	return varState;
}