import {useRef} from "react";
import {proxy, useSnapshot} from "valtio";
import {useIsoMemo} from "isoq";
import {qqlHydrate, qqlRemoveHydrate} from "quickmin/qql";
import {useQql} from "katnip"; //../../src/exports/exports-browser.jsx";
export {vbind} from "./valtio-util.jsx";

const proxyStateForUndefined = proxy({ value: undefined });

export function useData(queryOrUndefined, deps=[]) {
	let haveQuery=!!queryOrUndefined;
	let {swr,proxy:doProxy,...query}=queryOrUndefined||{};
	let qql=useQql();

	async function maybeQql(query) {
		if (!haveQuery)
			return;

		return qql(qqlRemoveHydrate(query))
	}

	function hydrate(data) {
		if (!data)
			return;

		data=qqlHydrate({qql,data,...query});
		if (doProxy)
			data=proxy(data);

		return data;

	}

	let data=useIsoMemo(()=>maybeQql(query),[query, ...deps],{swr, hydrate});
	useSnapshot((haveQuery&&doProxy)?data:proxyStateForUndefined);

	return data;
}
