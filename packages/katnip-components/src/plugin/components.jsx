export {Link} from "isoq-router";
import {Route} from "isoq-router";

export function PageRoute({Page}) {
	return (
		<Route path={Page.route}>
			<Page/>
		</Route>
	);
}
