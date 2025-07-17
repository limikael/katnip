import {useRef} from "react";
import {proxy, useSnapshot} from "valtio";
import {useIsoMemo} from "isoq";
import {qqlHydrateData} from "quickmin/qql";
import {useQql} from "quickmin/react";
export {vbind} from "./valtio-util.jsx";

export function useData(queryAndOptions, deps=[]) {
	let {swr, ...query}=queryAndOptions;

	let qql=useQql();
	let data=useIsoMemo(()=>query && qql(query),[query, ...deps],{swr});
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
