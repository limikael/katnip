import {useIsoContext} from "isoq";
import {RpcProvider} from "fullstack-rpc/react";

export default function({children}) {
	let iso=useIsoContext();

	return (
		<RpcProvider url="/rpc" fetch={iso.fetch}>
			{children}
		</RpcProvider>
	);
}