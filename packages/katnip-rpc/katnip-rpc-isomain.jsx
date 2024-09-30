import {useIsoContext} from "isoq";
import {RpcProvider} from "katnip-rpc";

export function Wrapper({children}) {
	let iso=useIsoContext();
	let url=iso.getAppUrl("/rpc")

	return (
		<RpcProvider url={url} fetch={iso.fetch}>
			{children}
		</RpcProvider>
	);
}