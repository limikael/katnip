import {Head, useIsoContext} from "isoq";

Wrapper.priority=20;
export function Wrapper({children}) {
	let iso=useIsoContext();

	return (<>
		<Head>
			<link href={iso.getAppUrl("index.css")} rel="stylesheet"/>
		</Head>
		{children}
	</>);
}
