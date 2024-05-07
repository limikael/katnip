import * as isoqRouter from "isoq-router";

export function Link({renderMode, ...props}) {
	//console.log("renderMode="+renderMode);

	if (!renderMode)
		return <isoqRouter.Link {...props}/>

	props.onClick=null;
	props.onclick=null;
	props.href=null;

	return <a {...props}>{props.children}</a>
}

Link.controls={
	href: {type: "text"},
	class: {type: "textarea"},
	style: {type: "textarea"},
};
