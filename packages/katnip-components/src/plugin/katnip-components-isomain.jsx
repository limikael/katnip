/*import {Env} from "../nocode/env.jsx";
import {Var, VarState} from "../nocode/var.jsx";*/
import {Env, VarState} from "katnip-components";
import {useIsoContext} from "isoq";

export function Wrapper({schema, children}) {
	let iso=useIsoContext();

	function createVarStates() {
		let varStates={};

		for (let collectionId in schema) {
			varStates[collectionId]=new VarState({
				qql: iso.qql,
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