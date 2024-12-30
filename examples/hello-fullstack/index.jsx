export default function() {
	return (<>
		<img src="/ACAI.png" class="w-20 h-20"/>
	</>)
}

/*	    "katnip-quickmin": "link:../../packages/katnip-quickmin",

import {useQql} from "katnip-quickmin/react";
import {useIsoMemo} from "isoq";

export default function() {
	let qql=useQql();
	let blogs=useIsoMemo(()=>qql({manyFrom: "blogs"}));

	if (!blogs)
		return;

	return (<>
		<h1 class="mb-5">Hello...</h1>
		<div class="bg-slate p-5 m-5 rounded text-white">test</div>
		<img src="/ACAI.png" class="w-20 h-20"/>

		{blogs.map(blog=>
			<div class="bg-slate p-5 m-5">
				<img src={"/admin/_content/"+blog.img} class="w-20 h-20"/>
				{blog.title}
			</div>
		)}
	</>)
}*/