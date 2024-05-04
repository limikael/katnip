import {PageRoute} from "katnip-components/components";

$$CJSX_IMPORTS$$

export default function() {
	let pages=CJSX_COMPONENTS.filter(c=>c.type=="Page");

	return (<>
		{pages.map(page=>
			<PageRoute Page={page}/>
		)}
	</>);
}