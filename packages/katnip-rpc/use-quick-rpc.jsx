import {createContext, useContext} from "react";
import {QuickRpc} from "./quick-rpc.js";

let QuickRpcContext=createContext();

export function QuickRpcProvider({fetch, url, children}) {
	let api=new QuickRpc({fetch, url});

	return (<>
		<QuickRpcContext.Provider value={api}>
			{children}
		</QuickRpcContext.Provider>
	</>);
}

export function useQuickRpc() {
	return useContext(QuickRpcContext).proxy;
}

export const useRpc=useQuickRpc;
