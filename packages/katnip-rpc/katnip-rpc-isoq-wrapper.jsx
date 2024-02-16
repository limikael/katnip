import {useIsoContext} from "isoq";
import {QuickRpcProvider} from "./use-quick-rpc.jsx";

export default function({children}) {
	let iso=useIsoContext();

	return (
		<QuickRpcProvider url="/rpc" fetch={iso.fetch}>
			{children}
		</QuickRpcProvider>
	);
}