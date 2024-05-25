import {useVar} from "../nocode/var.jsx";

function LiveAction({children, action, var: varName, ...props}) {
	let varState=useVar(varName);

	let reducers={
		increase: x=>x+1,
		decrease: x=>x-1,
	}

	function handleClick() {
		let reducer=reducers[action];
		if (!reducer)
			return;

		varState.set(reducer(varState.get()));
	}

	return <button onClick={handleClick} {...props}>{children}</button>
}

export function Action({renderMode, children, class: className, ...props}) {
	switch (renderMode) {
		case "editor":
			return (<button class={className} {...props}>
				{children}
			</button>);
			break;

		default:
			return (
				<LiveAction class={className} {...props}>
					{children}
				</LiveAction>
			);
			break;
	}
}

Action.styling=true;
Action.controls={
	action: {},
	var: {},
}