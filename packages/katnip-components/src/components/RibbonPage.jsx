import {useComponentLibrary} from "katnip-components";

export default function RibbonPage({header, footer, children, class: className}) {
	let components=useComponentLibrary();

	let Header=components[header];
	let Footer=components[footer];

	return (
		<div style="display: flex; flex-direction: column; min-height: 100%;">
			<div style="z-index: 1">
				<Header/>
			</div>
			<div style="flex: 1 1 0;" class={className}>
				{children}
			</div>
			<div>
				<Footer/>
			</div>
		</div>
	);
}

RibbonPage.description="Page with header and footer";
RibbonPage.defaultProps={
	header: "Header",
	footer: "Footer",
	class: "bg-base p-4",
};
RibbonPage.scaffold={
	"blocks/Header.cjsx":`
		<Block>
			<p class="bg-primary text-primaryContent p-4 font-bold text-xl">
				The Website
			</p>
		</Block>
	`,

	"blocks/Footer.cjsx":`
		<Block>
			<p class="bg-black text-white p-4 text-center">
				The Website
			</p>
		</Block>
	`
};
RibbonPage.keywords=["pageType"];
RibbonPage.category="Layout";
RibbonPage.displayName = "PageFrame";
RibbonPage.styling=true;
RibbonPage.materialSymbol="toolbar";
RibbonPage.containerType="children";
RibbonPage.controls={
	header: {type: "block"},
	footer: {type: "block"},
};