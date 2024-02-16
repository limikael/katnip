import {QuickminApiProvider} from "quickmin/use-api";
import {useIsoContext} from "isoq";

export default function({children}) {
    let iso=useIsoContext();

	return (
		<QuickminApiProvider url="/admin" fetch={iso.fetch}>
			{children}
		</QuickminApiProvider>
	);
}