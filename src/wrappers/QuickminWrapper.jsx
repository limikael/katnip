import {QuickminProvider} from "quickmin/react";
import {useIsoContext} from "isoq";
import urlJoin from "url-join";

export default function QuickminWrapper({quickminUser, quickminCookieName, authProviderInfo, children}) {
	let iso=useIsoContext();

    //console.log("Wrapper... ",authProviderInfo);

    return (
        <QuickminProvider
                fetch={iso.fetch}
                url="/admin" 
                initialUser={quickminUser}
                authProviderInfo={authProviderInfo}
                quickminCookieName={quickminCookieName}>
            {children}
        </QuickminProvider>
    );
}
