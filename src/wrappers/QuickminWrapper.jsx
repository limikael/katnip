import {QqlProvider, QuickminApiProvider, QuickminUserProvider} from "quickmin/react";
import {createQqlClient} from "quickmin/qql";
import {useIsoContext} from "isoq";
import {useRef} from "react";
import urlJoin from "url-join";

export default function QuickminWrapper({quickminUser, quickminCookieName, children}) {
	let iso=useIsoContext();
    let qqlRef=useRef();

    if (!qqlRef.current) {
    	qqlRef.current=createQqlClient({
    		url: urlJoin(iso.appPathname,"admin/_qql"),
    		fetch: iso.fetch
    	});

	    //iso.qql=qqlRef.current; why?
    }

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