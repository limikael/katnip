import {Route, useLocation} from "isoq-router";
import {splitPath} from "../utils/js-util.js";
import {Env} from "../nocode/env.jsx";
import {VarState} from "../nocode/var.jsx";
import {urlGetArgs, useIsoContext} from "isoq";
import {ComponentLibraryProvider, useComponentLibrary} from "katnip-components";
import {parseComponentExpr} from "../nocode/parser.js";
import {Fragment} from "react";

function RouteEnv({children, path, declarations}) {
	let location=useLocation();
	let iso=useIsoContext();

	function createVarStates() {
		let appParts=splitPath(iso.appPathname);
		let locationParts=urlGetArgs(location).slice(appParts.length);
		let patternParts=splitPath(path);
		let varStates={};

		//console.log("pattern=",patternParts," loc=",locationParts);

		for (let i=0; i<patternParts.length; i++) {
			if (patternParts[i].startsWith("{")) {
				let varName=parseComponentExpr(patternParts[i],{grammar: "declarationName"});
				//console.log("varname: "+varName);
				varStates[varName]=new VarState({value: locationParts[i]});
			}
		}

		return varStates;
	}

	//console.log("decl",declarations);

	return (
		<Env createVarStates={createVarStates} declarations={declarations}>
			{children}
		</Env>
	);
}

export default function PageRoute({Page}) {
	let componentLibrary=useComponentLibrary();
	let PageType=componentLibrary[Page.pageType];
	if (!PageType)
		PageType=Fragment;

	//console.log("this is the page route: ",Page);

	let pageRoute=Page.route;
	if (!pageRoute)
		return;

	let splitRoute=splitPath(pageRoute);
	let wildcardRoute=splitRoute.map(c=>c.startsWith("{")?"*":c);

	return (
		<Route path={wildcardRoute.join("/")}>
			<RouteEnv path={pageRoute} declarations={Page.declarations}>
				<PageType {...Page}>
					<Page/>
				</PageType>
			</RouteEnv>
		</Route>
	);
}
