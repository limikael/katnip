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

export function RibbonPage({header, footer, children, outer, inner}) {
	let [val,setVal]=useState(123);
	let components=useComponentLibrary();

	let Header=components[header];
	let Footer=components[footer];

	// flex flex-col min-h-[100%]
	// flex-1

	return (
		<div {...outer} style="display: flex; flex-direction: column; min-height: 100%;">
			<div>
				<Header/>
			</div>
			<div {...inner} style="flex: 1 1 0%;">
				{children}
			</div>
			<div>
				<Footer/>
			</div>
		</div>
	);
}

RibbonPage.wrap=false;
RibbonPage.tags=["pageType"];
RibbonPage.controls={
	header: {type: "block"},
	footer: {type: "block"},
};