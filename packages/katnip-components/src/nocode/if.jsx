//import {useVal, useVals, useExpr} from "./var.jsx";
import {useVarExpr} from "./expr.jsx";

export function If({expr, var: varName, test, children, display}) {
	let leftVar=useVarExpr(expr);
	let leftVal=leftVar.get();
	let rightVar=useVarExpr(varName);

	/*let exprVal=useExpr(expr);
	let varVal=useVal(varName);*/
	if (!test)
		test="true";

	let isTrue;
	switch (test) {
		/*case "notEmpty":
			isTrue=(val.length!=0);
			break;*/

		case "eq":
			isTrue=(leftVar.get()==rightVar.get());
			break;

		case "notEq":
			isTrue=(leftVar.get()!=rightVar.get());
			break;

		/*case "empty":
			isTrue=(val.length==0);
			break;*/

		case "true":
			if (leftVal==="false")
				leftVal=false;
			isTrue=!!leftVal;
			break;

		case "notTrue":
			if (leftVal==="false")
				leftVal=false;
			isTrue=!leftVal;
			break;

		default:
			throw new Error("Unknown if test: "+test);
			break;
	}

	//console.log("var: ",varVal," expr: ",exprVal," typeof exprVal:",(typeof exprVal)," isTrue: ",isTrue);

	if (isTrue)
		return (<div style={{display: display}}>{children}</div>);

	return (<div style={{display: display}}></div>);
}

If.editorPreview=({display, children})=><div style={{display}}>{children}</div>;
If.category="Logic";
If.materialSymbol="keyboard_option_key";
If.defaultProps={test: "eq", display: "block"};
If.containerType="children";
If.controls={
	test: {type: "select", options:{
		"eq": "Equal",
		"notEq": "Not equal",
		"true": "True",
		"notTrue": "False",
	}},
	var: {type: "expr", cond: ({test})=>["eq","notEq"].includes(test)},
	expr: {type: "expr"},
	display: {type: "select", options: ["block","inline-block","contents"]}
}
