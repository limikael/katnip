import {useQql} from "katnip-quickmin/react";
import {useIsoMemo} from "isoq";

export default function() {
	let qql=useQql();
	let pages=useIsoMemo(()=>qql({manyFrom: "pages"}));

	if (!pages)
		return;

	return (<>
		page titles:
		<ul>
			{pages.map(page=>
				<li>{page.title}</li>
			)}
		</ul>
	</>)
}