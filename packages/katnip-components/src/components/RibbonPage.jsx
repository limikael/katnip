import {useComponentLibrary} from "katnip-components";

export default function RibbonPage({header, footer, children, outer, inner}) {
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
RibbonPage.category="Layout";
RibbonPage.controls={
	header: {type: "block"},
	footer: {type: "block"},
};