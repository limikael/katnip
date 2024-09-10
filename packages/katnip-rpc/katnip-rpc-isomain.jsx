import {useIsoContext} from "isoq";
import {RpcProvider} from "katnip-rpc";

export function Wrapper({children}) {
	let iso=useIsoContext();

	return (
		<RpcProvider url="/rpc" fetch={iso.fetch}>
			{children}
		</RpcProvider>
	);
}