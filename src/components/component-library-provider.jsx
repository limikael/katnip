import {createContext, useContext, useState} from "react";

let ComponentLibraryContext=createContext();

export function ComponentLibraryProvider({components, children, assignGlobal}) {
	//console.log("provider...");

	if (assignGlobal && globalThis && globalThis.window)
		globalThis.window.__katnipComponentLibrary=components;

	return (
		<ComponentLibraryContext.Provider value={components}>
			{children}
		</ComponentLibraryContext.Provider>
	);
}

export function useComponentLibrary() {
	let components=useContext(ComponentLibraryContext);

	if (!components && globalThis.window && globalThis.window.__katnipComponentLibrary)
		return globalThis.window.__katnipComponentLibrary;

	return components;
}