export class DeclaredError extends Error {
	constructor(...args) {
		super(...args);
		this.declared=true;
	}
}

export class Job {
	constructor(stopper) {
		this.stopper=stopper;
	}

	async stop() {
		await this.stopper();
	}
}

export function jsonEq(a,b) {
	return (JSON.stringify(a)==JSON.stringify(b));
}

export function arrayUnique(a) {
	function onlyUnique(value, index, array) {
		return array.indexOf(value) === index;
	}

	return a.filter(onlyUnique);
}

export function includesAll(a, all) {
	for (let allItem of all)
		if (!a.includes(allItem))
			return false;

	return true;
}

export class ResolvablePromise extends Promise {
	constructor(cb = () => {}) {
        let resolveClosure = null;
        let rejectClosure = null;

		super((resolve,reject)=>{
            resolveClosure = resolve;
            rejectClosure = reject;

			return cb(resolve, reject);
		});

        this.resolveClosure = resolveClosure;
        this.rejectClosure = rejectClosure;
 	}

	resolve=(result)=>{
		this.resolveClosure(result);
	}

	reject=(reason)=>{
		this.rejectClosure(reason);
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

export function arrayFindDuplicate(arr) {
	for (let i=0; i<arr.length; i++)
		if (arr.slice(i+1).includes(arr[i]))
			return arr[i];
}

function isPlainObject(value) {
    if (!value)
        return false;

    if (value.constructor===Object)
        return true;

    if (value.constructor.toString().includes("Object"))
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