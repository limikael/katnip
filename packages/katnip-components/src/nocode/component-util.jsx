import {Env} from "./env.jsx";
import {VarState} from "./var.jsx";
import {useConstructor, useEventUpdate} from "../utils/react-util.jsx";

export function useNewVar(options) {
	let varState=useConstructor(()=>new VarState(options));
	useEventUpdate(varState,"change");

	return varState;
}

export function useNewVal(val) {
	return useNewVar({value: val});
}

export function useNewAction(fn) {
	let varState=useConstructor(()=>new VarState({type: "action", action: fn}));

	return varState;
}