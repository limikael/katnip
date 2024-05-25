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

export function useResizeObserver(ref, fn) {
	useLayoutEffect(()=>{
		let resizeObserver=new ResizeObserver(fn);
		resizeObserver.observe(ref.current);
		return (()=>{
			resizeObserver.disconnect();
		});
	},[ref,ref.current]);
}

export function useElementDimensions(ref) {
	let [dimensions,setDimensions]=useState();

	let updateDimensions=useCallback(()=>{
		let el=ref.current;
		setDimensions([el.clientWidth,el.clientHeight]);
	},[ref,ref.current]);

	useResizeObserver(ref,updateDimensions);
	useLayoutEffect(updateDimensions,[ref,ref.current]);

	return dimensions;
}
