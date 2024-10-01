import {useIsoContext} from "isoq";
import {RpcProvider} from "katnip-rpc";
import urlJoin from "url-join";

export function Wrapper({children}) {
	let iso=useIsoContext();
	//let url=iso.getAppUrl("/rpc")

	return (
		<RpcProvider url={urlJoin(iso.appPathname,"rpc")} fetch={iso.fetch}>
			{children}
		</RpcProvider>
	);
}