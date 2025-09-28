import {useRef} from "react";
import {proxy, useSnapshot} from "valtio";
import {useIsoMemo} from "isoq";
import {qqlHydrateData} from "quickmin/qql";
import {useQql} from "katnip"; //../../src/exports/exports-browser.jsx";
export {vbind} from "./valtio-util.jsx";

export function useData(query, deps=[]) {
	let swr;
	if (query) {
		query={...query};
		swr=query.swr;
		delete query.swr;
	}

	let qql=useQql();
	let data=useIsoMemo(async ()=>query && qql(query),[query, ...deps],{swr});
	let ref=useRef({});
	if (!ref.current.proxy || ref.current.data!=data) {
		ref.current.data=data;

		if (ref.current.data) {
			ref.current.proxy=proxy(structuredClone(data));
			qqlHydrateData({
				qql,
				data: ref.current.proxy,
				objectFactory: ()=>proxy({}),
				...query
			});
		}

		else {
			ref.current.proxy=undefined;
		}
	}

	useSnapshot(ref.current.proxy?ref.current.proxy:proxy());

	return ref.current.proxy;
}
