import {createContext, useContext} from "react";

let ComponentLibraryContext=createContext();

export function ComponentLibraryProvider({components, children}) {
	return (
		<ComponentLibraryContext.Provider value={components}>
			{children}
		</ComponentLibraryContext.Provider>
	);
}

export function useComponentLibrary() {
	let components=useContext(ComponentLibraryContext);

	return components;
}