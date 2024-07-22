import {useIsoContext} from "isoq";
import {RpcProvider} from "fullstack-rpc/react";

export function Wrapper({children}) {
	let iso=useIsoContext();

	return (
		<RpcProvider url="/rpc" fetch={iso.fetch}>
			{children}
		</RpcProvider>
	);
}