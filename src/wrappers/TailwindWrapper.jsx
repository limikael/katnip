import {Head} from "isoq";

export default function TailwindWrapper({children}) {
	return (<>
		<Head>
			<link href="/index.css" rel="stylesheet"/>
		</Head>
		<>{children}</>
	</>);
}