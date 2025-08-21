//import {QuickminProvider, QuickminState} from "katnip"; //"../../src/exports/exports-browser.jsx";
import {QuickminProvider, QuickminState} from "katnip"; //"../../src/exports/exports-browser.jsx";
import {useIsoContext} from "isoq";
import urlJoin from "url-join";

export default function QuickminWrapper({quickminUser, quickminCookieName, authProviderInfo, children}) {
	let iso=useIsoContext();

    if (!quickminCookieName)
        return children;

    if (!iso.quickminState)
        iso.quickminState=new QuickminState({
            fetch: iso.fetch,
            url: "/admin",
            initialUser: quickminUser,
            authProviderInfo: authProviderInfo,
            quickminCookieName: quickminCookieName,
        });

    //console.log("Wrapper... ",authProviderInfo);

    return (
        <QuickminProvider quickminState={iso.quickminState}>
            {children}
        </QuickminProvider>
    );
}
