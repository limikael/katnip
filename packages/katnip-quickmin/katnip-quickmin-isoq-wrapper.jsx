import {QuickminApiProvider} from "quickmin/use-api";
import {QqlProvider} from "qql/react";
import {useIsoContext} from "isoq";

export default function({children}) {
    let iso=useIsoContext();

	return (
		<QqlProvider url="/admin/_qql" fetch={iso.fetch}>
			<QuickminApiProvider url="/admin" fetch={iso.fetch}>
				{children}
			</QuickminApiProvider>
		</QqlProvider>
	);
}