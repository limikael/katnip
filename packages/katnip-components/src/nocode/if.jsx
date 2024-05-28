import {useVal, useVals, useExpr} from "./var.jsx";

export function If({var: varName, expr, test, children}) {
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
		return (<>{children}</>);

	return (<></>);
}
