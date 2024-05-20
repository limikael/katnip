import {Env, useEnv} from "./env.jsx";
import {useIsoMemo} from "isoq";
import {VarState, useExprs} from "./var.jsx";

function createObjectVarStates(o, extra={}) {
	let varStates={};
	for (let k in o)
		varStates[k]=new VarState({
			value: o[k]
		});

	for (let k in extra)
		varStates[k]=new VarState({
			value: extra[k]
		});

	return varStates;
}

function LiveFor({children, in: inVar, where, render, namespace, ...props}) {
	let env=useEnv();
	let collection=env.getVar(inVar);
	let whereExpr={};
	if (where)
		whereExpr=JSON.parse(where);

	let exprVals=useExprs(Object.values(whereExpr));
	let whereClause={};
	for (let i=0; i<Object.keys(whereExpr).length; i++)
		whereClause[Object.keys(whereExpr)[i]]=exprVals[i];

	//console.log(whereClause);

	let items=useIsoMemo(async ()=>await collection.qql({
		manyFrom: inVar,
		where: whereClause
	}),[]);

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
					createVarStates={()=>createObjectVarStates(row,{index})}
					namespace={namespace}>
				{children}
			</Env>
		);

	if (render)
		return render(renderedChildren);

	return (<>{renderedChildren}</>);
}

export function For({renderMode, children, ...props}) {
	switch (renderMode) {
		case "editor":
			return (<>
				{children}
			</>);
			break;

		default:
			return (
				<LiveFor {...props}>
					{children}
				</LiveFor>
			);
			break;
	}
}

For.controls={
	in: {},
	where: {type: "textarea"}
}