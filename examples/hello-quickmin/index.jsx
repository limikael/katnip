import {useQql} from "katnip-quickmin/react";
import {useIsoMemo} from "isoq";

export default function() {
	let qql=useQql();
	let pages=useIsoMemo(()=>qql({manyFrom: "pages"}));

	if (!pages)
		return;

	return (<>
		page titles: {pages.map(page=>page.title)}
	</>)
}