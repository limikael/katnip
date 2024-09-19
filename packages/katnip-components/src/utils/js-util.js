export function jsonClone(v) {
	return JSON.parse(JSON.stringify(v));
}

export function splitPath(pathname) {
	if (pathname===undefined)
		throw new Error("Undefined pathname");

	return pathname.split("/").filter(s=>s.length>0);
}

export function arrayUnique(a) {
	function onlyUnique(value, index, array) {
		return array.indexOf(value) === index;
	}

	return a.filter(onlyUnique);
}

export function arrayMove(array, initialIndex, finalIndex, num=1) {
	if (finalIndex>initialIndex)
		finalIndex--;

	array.splice(finalIndex,0,...array.splice(initialIndex,num));

	return array;
}

export function isStringy(s) {
	return ((typeof s=="string") || (s instanceof String));
}