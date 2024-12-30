export class DeclaredError extends Error {
	constructor(...args) {
		super(...args);
		this.declared=true;
	}
}

export function splitPath(pathname) {
	if (pathname===undefined)
		throw new Error("Undefined pathname");

	return pathname.split("/").filter(s=>s.length>0);
}

export function urlGetArgs(url) {
	return splitPath(new URL(url).pathname);
}

export function urlGetParams(url) {
	let u=new URL(url);
	return Object.fromEntries(u.searchParams);
}

function isPlainObject(value) {
    if (!value)
        return false;

    if (value.constructor===Object)
        return true;

    if (value.constructor.toString().includes("Object()"))
        return true;

    return false;
}

export function objectifyArgs(params, fields) {
    let conf={}, i=0;

    for (let param of params) {
        if (isPlainObject(param))
            conf={...conf,...param};

        else
        	conf[fields[i++]]=param;
    }

    return conf;
}

export function awaitEvent(...args) {
	let argsObj=objectifyArgs(args,["eventTarget", "type", "predicate"]);
	let {eventTarget, type, predicate, error}=argsObj;

	return new Promise((resolve, reject)=>{
		function messageHandler(message) {
			if (!predicate || predicate(message)) {
				if (error)
					eventTarget.off(error,errorHandler);

				resolve(message);
			}
		}

		function errorHandler(e) {
			eventTarget.off(type,messageHandler);
			if (error)
				eventTarget.off(error,errorHandler);

			reject(e);
		}

		eventTarget.on(type,messageHandler);
		if (error)
			eventTarget.on(error,errorHandler);
	});
}

export function arrayUnique(a) {
	function onlyUnique(value, index, array) {
		return array.indexOf(value) === index;
	}

	return a.filter(onlyUnique);
}

export function arrayFindDuplicate(arr) {
	for (let i=0; i<arr.length; i++)
		if (arr.slice(i+1).includes(arr[i]))
			return arr[i];
}
