$$CJSX_IMPORTS$$

import {Route} from "isoq-router";
import {ComponentLibraryProvider, useComponentLibrary} from "katnip-components";

// NEED TO CHECK HERE IF Page HAS A ROUTE!!!



export function PageRoute({Page}) {
	let components=useComponentLibrary();

	let PageType=({children})=><>{children}</>;
	if (components[Page.pageType])
		PageType=components[Page.pageType];

	return (
		<Route path={Page.route}>
			<PageType {...Page}>
				<Page/>
			</PageType>
		</Route>
	);
}

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