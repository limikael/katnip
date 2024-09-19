import {parse as parseXml} from "txml/txml";
import {arrayMove, isStringy} from "./js-util.js";

export function xmlForEach(element, fn) {
	if (element===undefined) return;
	if (Array.isArray(element)) {
		element.forEach(node=>xmlForEach(node,fn));
		return;
	}

	fn(element);
	xmlForEach(element.children,fn);
}

export function xmlFind(element, fn) {
	if (element===undefined) return;
	if (Array.isArray(element)) {
		for (let el of element) {
			let found=xmlFind(el,fn);
			if (found)
				return found;
		}

		return;
	}

	if (fn(element))
		return element;

	return xmlFind(element.children,fn);
}

export function xmlIndex(element, fn) {
	if (element===undefined) return;
	if (Array.isArray(element)) {
		for (let i=0; i<element.length; i++) {
			if (fn(element[i]))
				return i;

			let ci=xmlIndex(element[i],fn);
			if (ci>=0)
				return ci;
		}

		return -1;
	}

	return xmlIndex(element.children,fn);
}

export function xmlFragment(element, fn) {
	if (element===undefined) return;
	if (Array.isArray(element)) {
		for (let i=0; i<element.length; i++) {
			if (fn(element[i]))
				return element;

			let frag=xmlFragment(element[i],fn);
			if (frag)
				return frag;
		}

		return;
	}

	return xmlFragment(element.children,fn);
}

export function xmlPath(element, fn) {
	if (element===undefined) return;
	if (Array.isArray(element)) {
		for (let el of element) {
			let path=xmlPath(el,fn);
			if (path)
				return path;
		}

		return;
	}

	if (fn(element))
		return [element];

	let path=xmlPath(element.children,fn);
	if (path)
		return [element,...path];
}

export function xmlParent(element, fn) {
	if (element===undefined) return;

	let path=xmlPath(element,fn);
	if (path && path.length>1)
		return path[path.length-2];
}

export function xmlMove(root, fn, newFragment, newIndex) {
	if (newIndex===undefined)
		newIndex=newFragment.length;

	if (!Array.isArray(newFragment))
		throw new Error("expected array");

	let oldFragment=xmlFragment(root,fn);
	let oldIndex=xmlIndex(root,fn);

	/*if (oldFragment==newFragment) {
		arrayMove(oldFragment,oldIndex,newIndex);
		return;
	}*/

	let val=oldFragment[oldIndex];
	oldFragment.splice(oldIndex,1);

	if (oldFragment==newFragment &&
			oldIndex<newIndex)
		newIndex--;

	newFragment.splice(newIndex,0,val);//oldFragment[oldIndex]);
}

export function xmlMap(element, fn) {
	if (element===undefined)
		return;

	if (Array.isArray(element))
		return (element
			.map(n=>xmlMap(n,fn))
			.filter(i=>i!==undefined));

	if (isStringy(element))
		return fn(element);

	element=fn(element);
	element.children=xmlMap(element.children,fn);
	return element;
}
