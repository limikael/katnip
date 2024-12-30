import {createQqlClient, QqlProvider, useQql, 
		QuickminApiProvider, QuickminUserProvider} from "katnip-quickmin/react";
import {useIsoContext} from "isoq";
import urlJoin from "url-join";
import {useRef} from "react";	

Wrapper.priority=5;
export function Wrapper({quickminUser, quickminCookieName, children}) {
    let iso=useIsoContext();
    let qqlRef=useRef();
    if (!qqlRef.current) {
    	qqlRef.current=createQqlClient({
    		url: urlJoin(iso.appPathname,"admin/_qql"),
    		fetch: iso.fetch
    	});

	    iso.qql=qqlRef.current;
    }

    //console.log("quickmin client wrapper!!!");
    //console.log("qql provider, ssr="+iso.isSsr()+" appPathname="+iso.appPathname);

	return (
		<QqlProvider qql={qqlRef.current}>
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