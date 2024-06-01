import {toChildArray} from 'preact';
import {useElementDimensions} from "../utils/react-util.jsx"
import {useRef} from "react";
import {useFeather} from "use-feather";
import {For} from "../nocode/for.jsx";
import {useVar} from "../nocode/var.jsx";

function Carousel({pageIndex, children}) {
	children=toChildArray(children);
	let containerRef=useRef();
	let innerRef=useRef();
	let dimensions=useElementDimensions(containerRef);
	let feather=useFeather(v=>innerRef.current.style.transform=`translateX(${v}px)`);

	let containerStyle={
		overflow: "hidden",
		whiteSpace: "nowrap"
	}

	if (!dimensions) {
		dimensions=[0,0];
		containerStyle.visibility="hidden";
	}

	pageIndex=parseInt(pageIndex);
	if (!pageIndex)
		pageIndex=0;

	//console.log(pageIndex);

	feather.setTarget(-pageIndex*dimensions[0]);

	let childStyle={
		display: "inline-block",
		whiteSpace: "normal",
		verticalAlign: "middle",
		width: dimensions[0]+"px",
	}

	return (<>
		<div ref={containerRef} style={containerStyle}>
			<div ref={innerRef}>
				{children.map(child=>
					<div style={childStyle}>
						{child}
					</div>
				)}
			</div>
		</div>
	</>);
}

export function ForCarousel({indexVar, children, ...props}) {
	let indexVarState=useVar(indexVar);

	let renderCarousel=children=>
		<Carousel pageIndex={indexVarState.get()}>
			{children}
		</Carousel>;

	return (
		<For {...props} render={renderCarousel}>
			{children}
		</For>
	);
}

ForCarousel.editorPreview=({children})=><>{children}</>;
ForCarousel.category="Animation";
ForCarousel.controls={
	in: {},
	indexVar: {},
	where: {type: "textarea"}
}