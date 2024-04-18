import {QuickminApiProvider, QuickminUserProvider} from "quickmin/use-api";
import {QqlProvider} from "qql/react";
import {useIsoContext} from "isoq";

export default function({quickminUser, children}) {
    let iso=useIsoContext();

    //console.log("quickminUser: ",quickminUser);

	return (
		<QqlProvider url="/admin/_qql" fetch={iso.fetch}>
			<QuickminApiProvider url="/admin" fetch={iso.fetch}>
				<QuickminUserProvider initialUser={quickminUser}>
					{children}
				</QuickminUserProvider>
			</QuickminApiProvider>
		</QqlProvider>
	);
}