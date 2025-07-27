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
