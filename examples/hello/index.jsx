import {useIsoMemo} from "isoq";
import {useRpc} from "katnip-rpc";
import {useEffect} from "react";

export default function() {
	let rpc=useRpc();
	let val=useIsoMemo(async()=>{
		console.log("running ref...");
		return 123;
	});

	useEffect(()=>{
		(async()=>{
			console.log("calling rpc..")
			let res=await rpc.test(1,2);
			console.log("res: "+res);
		})();
	},[])

	return (<>
		<h1 class="p-5">test again: {val}</h1>
	</>);
}