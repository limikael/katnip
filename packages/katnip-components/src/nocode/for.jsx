import {Env, useEnv} from "./env.jsx";
import {useIsoMemo} from "isoq";
import {VarState} from "./var.jsx";
import {useVarExpr, useVarExprs} from "./expr.jsx";
import {toChildArray} from 'preact';
import {Fragment, useState} from "react";
import {arrayUnique} from "../utils/js-util.js";
import {useEventListener} from "../utils/react-util.jsx";

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

export function For({children, in: inVar, where, namespace,
		setCount, setLastIndex, count: countExpr, insert}) {
	let env=useEnv();
	let collection=useVarExpr(inVar,{assignable: true});
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

	if (!namespace)
		namespace=inVar;

	function createVarStates(item, index) {
		let varStates={};

		let fieldNames=Object.keys(item);
		if (collection.fields)
			fieldNames=arrayUnique([
				...fieldNames,
				...Object.keys(collection.fields)
			]);

		for (let fieldName of fieldNames) {
			let type;
			if (collection.fields && collection.fields[fieldName])
				type=collection.fields[fieldName].type;

			let value=item[fieldName];
			if (type=="image")
				value="/admin/_content/"+value;

			varStates[fieldName]=new VarState({
				value: value,
				type: type
			});
		}

		varStates.index=new VarState({value: index});

		if (collection.type=="collection") {
			async function handleSave() {
				if (insert) {
					let set={};
					for (let fieldName in collection.fields) {
						set[fieldName]=varStates[fieldName].get();
					}

					set={...set,...whereClause};

					//console.log("inserting");
					//console.log(set);

					await collection.qql({
						insertInto: collection.collectionId,
						set: set,
					});

					collection.dispatchEvent(new Event("change"));
				}

				else {
					let set={};
					for (let fieldName in collection.fields) {
						set[fieldName]=varStates[fieldName].get();
					}

					await collection.qql({
						update: collection.collectionId,
						set: set,
						where: {id: item.id}
					});

					collection.dispatchEvent(new Event("change"));
				}
			}

			varStates.save=new VarState({type: "action", action: handleSave});

			if (!insert) {
				async function handleDelete() {
					await collection.qql({
						deleteFrom: collection.collectionId,
						where: {id: item.id}
					});

					collection.dispatchEvent(new Event("change"));
					//setRefreshCount(refreshCount+1);
				}

				varStates.delete=new VarState({type: "action", action: handleDelete});
			}
		}

		return varStates;
	}

	let renderedChildren=[];
	if (items) {
		renderedChildren=items.map((item,index)=>
			<Env key={insert?"insert":item.id}
					createVarStates={()=>createVarStates(item,index)}
					namespace={namespace}>
				{children}
			</Env>
		);
	}

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
For.materialSymbol="laps";
For.envSpec=(props, envSpec)=>{
	let spec={
		save: {type: "action"},
		delete: {type: "action"},
	};

	let inVar=props.in?props.in:"";
	inVar=inVar.replace("$","");
	let collectionSpec=envSpec[inVar];
	if (collectionSpec)
		spec={...spec, ...collectionSpec.fields};

	return spec;
}
For.containerType="children";
For.displayName = "Loop"
For.controls={
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
