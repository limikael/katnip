import {useQql, useIsoMemo} from "katnip";

export default function() {
	let qql=useQql();
	let pages=useIsoMemo(()=>qql({"manyFrom": "pages"}));

	return (<>
		<div class="p-5">hello</div>
		{pages && pages.map(page=>
			<div class="m-2 p-2 border">{page.content}</div>
		)}
	</>);
}