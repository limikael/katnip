import {useIsoContext} from "isoq";
import {RpcProvider} from "fullstack-rpc/react";
import urlJoin from "url-join";

export default function RpcWrapper({children}) {
	let iso=useIsoContext();
	//let url=iso.getAppUrl("/rpc")

	//console.log("isofetch: ",iso.fetch);

	return (
		<RpcProvider url={"/rpc"} fetch={iso.fetch}>
			{children}
		</RpcProvider>
	);
}