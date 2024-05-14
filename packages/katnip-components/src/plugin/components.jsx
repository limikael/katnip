import * as isoqRouter from "isoq-router";
import {useComponentLibrary} from "katnip-components";
import {useState} from "react";

export function Link({renderMode, ...props}) {
	//console.log("renderMode="+renderMode);

	if (!renderMode)
		return <isoqRouter.Link {...props}/>

	props.onClick=null;
	props.onclick=null;
	props.href=null;

	return <a {...props}>{props.children}</a>
}

Link.styling=true;
Link.controls={
	href: {type: "text"}
};

export function RibbonPage({header, footer, children}) {
	let [val,setVal]=useState(123);
	let components=useComponentLibrary();

	let Header=components[header];
	let Footer=components[footer];

	/*return (
		<div>I'm a ribbon page: {val}</div>
	);*/

	return (
		<div>
			<Header/>
			{children}
			<Footer/>
		</div>
	);
}

RibbonPage.tags=["pageType"];
RibbonPage.controls={
	header: {type: "block"},
	footer: {type: "block"},
};