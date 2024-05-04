import {Head, useIsoContext} from "isoq";

export default function({children}) {
	let iso=useIsoContext();

	return (<>
		<Head>
			<link href={iso.getAppUrl("index.css")} rel="stylesheet"/>
		</Head>
		{children}
	</>);
}