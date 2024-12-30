import {useRpc} from "katnip-rpc";
import {useIsoMemo} from "isoq";

export default function() {
	let rpc=useRpc();
	let val=useIsoMemo(async()=>{
		return await rpc.hello123();
	});

	return (<>
		<h1>hello</h1>
		val: {val}
	</>);
}