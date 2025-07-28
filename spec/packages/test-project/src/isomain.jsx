import {useData, useRpc, useIsoMemo} from "katnip";

export default function() {
	let data=useData({manyFrom: "pages"});
	let rpc=useRpc();
	let val=useIsoMemo(async ()=>rpc.test(123));

	return (<div class="m-5">hello isoq, data={JSON.stringify(data)} val={val}</div>);
}