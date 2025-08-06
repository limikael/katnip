import { proxy, useSnapshot } from 'valtio';
import { useRef } from 'react';

export function useProxy(initialValue) {
    const ref = useRef();
    if (!ref.current) {
    	if (typeof initialValue=="function")
    		initialValue=initialValue();

    	//console.log("proxying... ",initialValue);
	    ref.current = proxy(initialValue);
    }

    const snap = useSnapshot(ref.current);
    return ref.current;
}

export function vbind(object, field, {onChange, mode}={}) {
	if (!mode)
		mode="input";

	function handleChange(ev) {
		let value=ev;
		if (ev instanceof Event) {
			if (mode=="checkbox")
				value=!!ev.target.checked;

			else
				value=ev.target.value;
		}

		object[field]=value;
		if (onChange)
			onChange(value);
	}

	if (mode=="checkbox") {
		return ({
			checked: !!object[field],
			onChange: handleChange,
			autocomplete: "off"
		})
	}

	return ({
		value: object[field],
		onChange: handleChange,
		autocomplete: "off"
	});
}
