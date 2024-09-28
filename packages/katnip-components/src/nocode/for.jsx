import {Env, useEnv} from "./env.jsx";
import {useIsoMemo} from "isoq";
import {VarState, useExprs, useVar} from "./var.jsx";
import {toChildArray} from 'preact';
import {Fragment} from "react";

export function useExpandChildren(children) {
	children=toChildArray(children);
	if (children.length==1 && 
			typeof children[0].type=="function" &&
			children[0].type.expandChildren) {
		let child=children[0];
		let fn=child.type;
		let res=fn(child.props);

		if (res.type==Fragment)
			return res.props.children;

		if (Array.isArray(res))
			return res;

		return [res];
	}

	return children;
}

function createObjectVarStates(o, fieldSpecs, extra={}) {
	let varStates={};
	for (let k in o) {
		let type;
		if (fieldSpecs && fieldSpecs[k])
			type=fieldSpecs[k].type;

		let value=o[k];
		if (type=="image")
			value="/admin/_content/"+value;

		varStates[k]=new VarState({
			value: value,
			type: type
		});
	}

	for (let k in extra)
		varStates[k]=new VarState({
			value: extra[k]
		});

	return varStates;
}

function useWhere(where) {
	let whereExpr={};
	if (where) {
		if (typeof where=="string")
			whereExpr=JSON.parse(where);

		else
			whereExpr=where;
	}

	//console.log(collection.fields);

	let exprVals=useExprs(Object.values(whereExpr));
	let whereClause={};
	for (let i=0; i<Object.keys(whereExpr).length; i++)
		whereClause[Object.keys(whereExpr)[i]]=exprVals[i];

	return whereClause;
}

/*export function Repeat({children, count: countExpr}) {
	let count=useExpr(countExpr);

	let renderedChildren=[];
	for (let i=0; i<count; i++) {
		renderedChildren.push(
			<Env key={i} declarations={{index: i}}>
				{children}
			</Env>
		)
	}

	return (<>{renderedChildren}</>);
}*/

export function For({children, in: inVar, where, render, namespace, setCount, setLastIndex, count: countExpr}) {
	let env=useEnv();
	let collection=useVar(inVar);
	let countVar=useVar(countExpr);
	let whereClause=useWhere(where);
	let items=useIsoMemo(async ()=>{
		if (!collection)
			return;

		if (collection.type!="collection")
			return;

		return await collection.qql({
			manyFrom: inVar.replace("$",""),
			where: whereClause
		});
	},[whereClause]);

	if (collection && collection.type!="collection")
		items=collection.get();

	//console.log(items);

	if (items) {
		if (setCount)
			env.getVar(setCount).set(items.length)

		if (setLastIndex)
			env.getVar(setLastIndex).set(items.length-1)
	}

	if (!namespace)
		namespace=inVar;

	let renderedChildren=[];
	if (items)
		renderedChildren=items.map((row,index)=>
			<Env key={row.id}
					createVarStates={()=>createObjectVarStates(row,collection.fields,{index})}
					namespace={namespace}>
				{children}
			</Env>
		);

	else if (countVar) {
		for (let i=0; i<countVar.get(); i++) {
			renderedChildren.push(
				<Env key={i} declarations={{index: i}}>
					{children}
				</Env>
			)
		}
	}

	return (<>{renderedChildren}</>);
}

For.editorPreview=({children})=><div>{children}</div>;
For.expandChildren=true;
For.category="Logic";
For.icon = {
	type: "material",
	symbol: "laps"
}
For.envSpec=(props, envSpec)=>{
	let inVar=props.in?props.in:"";
	inVar=inVar.replace("$","");
	let collectionSpec=envSpec[inVar];
	if (!collectionSpec)
		return;

	return collectionSpec.fields;
}
For.containerType="children";
For.displayName = "Loop"
For.controls={
	in: {type: "collection"},
	where: {type: "where", collectionVar: "in"}
}
