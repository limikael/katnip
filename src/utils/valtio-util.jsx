import { proxy, useSnapshot } from 'valtio';
import { useRef } from 'react';

export function useProxy(initialValue) {
    const ref = useRef();
    if (!ref.current) {
    	//console.log("proxying... ",initialValue);
	    ref.current = proxy(initialValue);
    }

    const snap = useSnapshot(ref.current);
    return ref.current;
}

export function vbind(object, field, {onChange}={}) {
	function handleChange(ev) {
		let value=ev;
		if (ev instanceof Event)
			value=ev.target.value;

		object[field]=value;
		if (onChange)
			onChange(value);
	}

	return ({
		value: object[field],
		onChange: handleChange,
		autocomplete: "off"
	});
}
