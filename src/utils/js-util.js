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
