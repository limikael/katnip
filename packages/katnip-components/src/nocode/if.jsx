import {useVal, useVals, useExpr} from "./var.jsx";

export function If({var: varName, expr, test, children, display}) {
	let exprVal=useExpr(expr);
	let varVal=useVal(varName);
	if (!test)
		test="true";

	let isTrue;
	switch (test) {
		/*case "notEmpty":
			isTrue=(val.length!=0);
			break;*/

		case "eq":
			isTrue=(varVal==exprVal);
			break;

		case "notEq":
			isTrue=(varVal!=exprVal);
			break;

		/*case "empty":
			isTrue=(val.length==0);
			break;*/

		case "true":
			if (exprVal==="false")
				exprVal=false;
			isTrue=!!exprVal;
			break;

		case "notTrue":
			if (exprVal==="false")
				exprVal=false;
			isTrue=!exprVal;
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
