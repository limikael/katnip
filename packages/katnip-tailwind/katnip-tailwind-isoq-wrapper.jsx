import {Head} from "isoq";

export default function({children}) {
	return (<>
		<Head>
			<link href="/index.css" rel="stylesheet"/>
		</Head>
		{children}
	</>);
}