import {Route, useLocation} from "isoq-router";
import {splitPath} from "../utils/js-util.js";
import {Env} from "../nocode/env.jsx";
import {VarState} from "../nocode/var.jsx";
import {urlGetArgs, useIsoContext} from "isoq";

function RouteEnv({children, path}) {
	let location=useLocation();
	let iso=useIsoContext();

	function createVarStates() {
		let appParts=splitPath(iso.appPathname);
		let locationParts=urlGetArgs(location).slice(appParts.length);
		let patternParts=splitPath(path);
		let varStates={};

		//console.log("pattern=",patternParts," loc=",locationParts);

		for (let i=0; i<patternParts.length; i++) {
			if (patternParts[i].startsWith("$")) {
				let varName=patternParts[i].replace("$","");
				//console.log("varname: "+varName);
				varStates[varName]=new VarState({value: locationParts[i]});
			}
		}

		return varStates;
	}

	return (
		<Env createVarStates={createVarStates}>
			{children}
		</Env>
	);
}

export default function PageRoute({Page}) {
	let pageRoute=Page.route;
	if (!pageRoute)
		return;

	let splitRoute=splitPath(pageRoute);
	let wildcardRoute=splitRoute.map(c=>c.startsWith("$")?"*":c);

	return (
		<Route path={wildcardRoute.join("/")}>
			<RouteEnv path={pageRoute}>
				<Page/>
			</RouteEnv>
		</Route>
	);
}
