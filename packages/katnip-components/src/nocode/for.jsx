import {Env, useEnv} from "./env.jsx";
import {useIsoMemo} from "isoq";
import {VarState} from "./var.jsx";
import {useVarExpr, useVarExprs} from "./expr.jsx";
import {toChildArray} from 'preact';
import {Fragment, useState} from "react";
import {arrayUnique} from "../utils/js-util.js";
import {useEventListener, useConstructor} from "../utils/react-util.jsx";
import {parseComponentExpr} from "../nocode/parser.js";

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

function useWhere(where) {
	let whereExpr={};
	if (where) {
		if (typeof where=="string")
			whereExpr=JSON.parse(where);

		else
			whereExpr=where;
	}

	//console.log(collection.fields);

	let exprVars=useVarExprs(Object.values(whereExpr));
	let whereClause={};
	for (let i=0; i<Object.keys(whereExpr).length; i++)
		whereClause[Object.keys(whereExpr)[i]]=exprVars[i].get();

	return whereClause;
}

function ItemEnv({item, index, collection, insert, whereClause, children, let: letExpr}) {
	let letName=parseComponentExpr(letExpr,{grammar: "declarationName"});
	async function handleInsert(set) {
		set={...set,...whereClause};

		await collection.qql({
			insertInto: collection.collectionId,
			set: set,
		});

		collection.dispatchEvent(new Event("change"));
	}

	async function handleSave(set) {
		await collection.qql({
			update: collection.collectionId,
			set: set,
			where: {id: item.id}
		});

		collection.dispatchEvent(new Event("change"));
	}

	async function handleDelete() {
		await collection.qql({
			deleteFrom: collection.collectionId,
			where: {id: item.id}
		});

		collection.dispatchEvent(new Event("change"));
	}

	function createVarStates() {
		let varStates={};
		let declarationItem={...item};

		let fieldNames=Object.keys(declarationItem);
		if (collection.fields)
			fieldNames=arrayUnique([
				...fieldNames,
				...Object.keys(collection.fields)
			]);

		for (let fieldName of fieldNames)
			if (!declarationItem.hasOwnProperty(fieldName))
				declarationItem[fieldName]=undefined;

		for (let fieldName of fieldNames) {
			if (collection.fields[fieldName]?.type=="image" &&
					declarationItem[fieldName])
				declarationItem[fieldName]="/admin/_content/"+declarationItem[fieldName];
		}

		function getItem() {
			let currentItem={};

			if (letName) {
				for (let k of fieldNames)
					currentItem[k]=varStates[letName].get()[k];
			}

			else {
				for (let k of fieldNames)
					currentItem[k]=varStates[k].get();
			}

			return currentItem;
		}

		if (collection.type=="collection") {
			if (insert) {
				declarationItem.save=()=>handleInsert(getItem());
			}

			else {
				declarationItem.save=()=>handleSave(getItem());
				declarationItem.delete=()=>handleDelete(getItem());
			}
		}

		declarationItem.index=index;

		if (letName) {
			varStates[letName]=new VarState({value: declarationItem});
		}

		else {
			for (let k in declarationItem)
				varStates[k]=new VarState({value: declarationItem[k]})
		}

		return varStates;
	}

	return (
		<Env createVarStates={createVarStates}
				children={children}/>
	);
}

export function For({children, in: inVar, where, namespace,
		setCount, setLastIndex, count: countExpr, insert,
		let: letExpr}) {
	let env=useEnv();
	let collection=useVarExpr(inVar,{grammar: "assignable"});
	let countVar=useVarExpr(countExpr);
	let whereClause=useWhere(where);
	let [refreshCount,setRefreshCount]=useState(1);
	useEventListener(collection,"change",()=>{
		setRefreshCount(refreshCount+1)
	});
	let items=useIsoMemo(async ()=>{
		if (insert)
			return [{}];

		if (!collection)
			return;

		if (collection.type!="collection")
			return;

		return await collection.qql({
			manyFrom: collection.collectionId,
			where: whereClause
		});
	},[whereClause,refreshCount]);

	if (collection && collection.type!="collection")
		items=collection.get();

	//console.log(items);

	if (items) {
		if (setCount)
			env.getVar(setCount).set(items.length)

		if (setLastIndex)
			env.getVar(setLastIndex).set(items.length-1)
	}

	if (items) {
		return (<>
			{items.map((item,index)=>
				<ItemEnv
						key={insert?"insert":item.id}
						item={item}
						index={index}
						collection={collection}
						namespace={namespace}
						insert={insert}
						whereClause={whereClause}
						children={children}
						let={letExpr}/>
			)}
		</>);
	}

	if (countVar) {
		let renderedChildren=[];
		for (let i=0; i<countVar.get(); i++) {
			renderedChildren.push(
				<Env key={i} declarations={{index: i}}>
					{children}
				</Env>
			);
		}

		return (<>{renderedChildren}</>);
	}
}

For.editorPreview=({children})=><div>{children}</div>;
For.expandChildren=true;
For.category="Logic";
For.materialSymbol="laps";
For.envSpec=(props, envSpec)=>{
	let inName=parseComponentExpr(props.in,{grammar: "declarationName"});
	if (!inName)
		return;

	let spec={
		save: {type: "action"},
		delete: {type: "action"},
	};

	let collectionSpec=envSpec[inName];
	if (collectionSpec) {
		spec.id={};
		for (let fieldName in collectionSpec.fields) {
			let fieldSpec=collectionSpec.fields[fieldName];

			if (fieldSpec.type.toLowerCase()!="referencemany")
				spec[fieldName]=fieldSpec;
		}
	}

	let letName=parseComponentExpr(props.let,{grammar: "declarationName"});
	if (letName)
		spec={
			[letName]: {type: "object", fields: spec}
		}

	return spec;
}
For.containerType="children";
For.displayName = "Loop"
For.controls={
    let: {type: "text"},
	in: {type: "collection"},
	where: {type: "where", collectionVar: "in"}
}

export function InsertForm(props) {
	return (
		<For {...props} insert="true"/>
	);
}

InsertForm.editorPreview=({children})=><div>{children}</div>;
InsertForm.category="Logic";
InsertForm.materialSymbol="add_card";
InsertForm.envSpec=(props, envSpec)=>{
	let spec=For.envSpec(props,envSpec);
	delete spec.delete;

	return spec;
}
InsertForm.containerType="children";
InsertForm.controls=For.controls;
