$$CJSX_IMPORTS$$

import {PageRoute, ComponentLibraryProvider} from "katnip-components";

export default function() {
	let pages=Object.values(CJSX_COMPONENTS)
		.filter(c=>(c.type=="Page" && c.route!==undefined));

	return (<>
		<ComponentLibraryProvider components={CJSX_COMPONENTS}>
			{pages.map(page=>
				<PageRoute Page={page}/>
			)}
		</ComponentLibraryProvider>
	</>);
}