export class DeclaredError extends Error {
	constructor(...args) {
		super(...args);
		this.declared=true;
	}
}

export async function responseAssert(response) {
	if (response.status>=200 && response.status<300)
		return;

	let e=new Error(await response.text());
	e.status=response.status;

	throw e;
}

export function arrayify(a) {
	if (Array.isArray(a))
		return a;

	if (a===undefined)
		return [];

	return [a];
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

export function objectMerge(a, b) {
    a = a ?? {};
    b = b ?? {};
    const result = { ...a };
    for (const [key, bVal] of Object.entries(b)) {
        const aVal = a[key];
        if (
            aVal && bVal &&
            typeof aVal === 'object' && !Array.isArray(aVal) &&
            typeof bVal === 'object' && !Array.isArray(bVal)
        ) {
            result[key] = objectMerge(aVal, bVal);
        } else {
            result[key] = bVal;
        }
    }
    return result;
}
