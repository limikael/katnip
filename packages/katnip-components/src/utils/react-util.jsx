import {useLayoutEffect, useState, useCallback, useRef} from "react";

export function useEventListener(o, ev, fn) {
	useLayoutEffect(()=>{
		if (o)
			o.addEventListener(ev,fn);

		return ()=>{
			if (o)
				o.removeEventListener(ev,fn);
		}
	},[o,ev,fn]);
}

export function useEventUpdate(o, ev) {
	let [_,setDummyState]=useState();
	let forceUpdate=useCallback(()=>setDummyState({}));
	useEventListener(o,ev,forceUpdate);
}

export function useConstructor(fn) {
	let value=useRef();
	let called=useRef();

	if (!called.current) {
		called.current=true;
		value.current=fn();
	}

	return value.current;
}
