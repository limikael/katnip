import {useQql} from "katnip-quickmin/react";
import {useIsoMemo} from "isoq";

export default function() {
	let qql=useQql();
	let pages=useIsoMemo(()=>qql({manyFrom: "pages"}));

	if (!pages)
		return;

	return (<>
		<div>hello cloudflare page</div>
		<div>
			page titles: {pages.map(page=>page.title)}
		</div>
	</>)
}
