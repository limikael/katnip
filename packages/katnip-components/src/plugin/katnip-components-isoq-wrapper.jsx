import {useQql} from "qql/react";
import {Env} from "../nocode/env.jsx";
import {Var, VarState} from "../nocode/var.jsx";

export default function({schema, children}) {
	let qql=useQql();

	function createVarStates() {
		let varStates={};

		for (let collectionId in schema) {
			varStates[collectionId]=new VarState({
				qql: qql,
				type: "collection",
				fields: schema[collectionId].fields
			});
		}

		return varStates;
	}

	return (<>
		<Env createVarStates={createVarStates}>
			{children}
		</Env>
	</>);
}