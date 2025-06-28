import {useIsoContext} from "isoq";
import {RpcProvider} from "fullstack-rpc/react";
import urlJoin from "url-join";

export default function RpcWrapper({children}) {
	let iso=useIsoContext();
	//let url=iso.getAppUrl("/rpc")

	return (
		<RpcProvider url={urlJoin(iso.appPathname,"rpc")} fetch={iso.fetch}>
			{children}
		</RpcProvider>
	);
}