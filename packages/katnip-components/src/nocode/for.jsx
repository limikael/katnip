import {Env, useEnv} from "./env.jsx";
import {useIsoMemo} from "isoq";
import {VarState, useExprs} from "./var.jsx";

function createObjectVarStates(o, fieldSpecs, extra={}) {
	let varStates={};
	for (let k in o) {
		let type;
		if (fieldSpecs[k])
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

export function For({children, in: inVar, where, render, namespace, ...props}) {
	inVar=inVar.replace("$","");
	let env=useEnv();
	let collection=env.getVar(inVar);
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

	//console.log("render for",whereClause);

	let items=useIsoMemo(async ()=>await collection.qql({
		manyFrom: inVar,
		where: whereClause
	}),[whereClause]);

	if (!namespace)
		namespace=inVar;

	if (collection.type!="collection")
		throw new Error("Not a collection");

	/*console.log(collection);
	console.log(items);*/

	let renderedChildren=[];
	if (items)
		renderedChildren=items.map((row,index)=>
			<Env key={row.id}
					createVarStates={()=>createObjectVarStates(row,collection.fields,{index})}
					namespace={namespace}>
				{children}
			</Env>
		);

	if (render)
		return render(renderedChildren);

	return (<>{renderedChildren}</>);
}

For.editorPreview=({children})=><div>{children}</div>;
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
