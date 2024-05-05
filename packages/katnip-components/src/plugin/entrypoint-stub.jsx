$$CJSX_IMPORTS$$

import {Route} from "isoq-router";

export function PageRoute({Page}) {
	return (
		<Route path={Page.route}>
			<Page/>
		</Route>
	);
}

export default function() {
	let pages=CJSX_COMPONENTS.filter(c=>c.type=="Page");

	return (<>
		{pages.map(page=>
			<PageRoute Page={page}/>
		)}
	</>);
}