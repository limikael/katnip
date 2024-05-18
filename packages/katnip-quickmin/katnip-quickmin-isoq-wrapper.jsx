import {QuickminApiProvider, QuickminUserProvider} from "quickmin/use-api";
import {QqlProvider} from "qql/react";
import {useIsoContext} from "isoq";
import urlJoin from "url-join";

export default function({quickminUser, quickminCookieName, children}) {
    let iso=useIsoContext();

    //console.log("qql provider, ssr="+iso.isSsr()+" appPathname="+iso.appPathname);

	return (
		<QqlProvider url={urlJoin(iso.appPathname,"admin/_qql")} fetch={iso.fetch}>
			<QuickminApiProvider url={urlJoin(iso.appPathname,"admin")} fetch={iso.fetch}>
				<QuickminUserProvider
						initialUser={quickminUser}
						quickminCookieName={quickminCookieName}>
					{children}
				</QuickminUserProvider>
			</QuickminApiProvider>
		</QqlProvider>
	);
}