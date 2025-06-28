import {useQql, useIsoMemo, useRpc} from "katnip";

export default function() {
	let rpc=useRpc();
	let qql=useQql();
	let pages=useIsoMemo(()=>qql({manyFrom: "pages"}));
	let rpcRes=useIsoMemo(()=>rpc.testFunc(456));

	if (!pages)
		return;

	return (<>
		<div class="p-5">
			{pages.map(page=>
				<div>{page.content}</div>
			)}
		</div>
		<div>
			{rpcRes}
		</div>
	</>);
}