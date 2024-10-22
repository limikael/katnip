import {useVarExpr} from "./expr.jsx";
import {useExpandChildren} from "./for.jsx";
import {createContext, useContext} from "react";
import {Env} from "./env.jsx";
import {useNewVar} from "./component-util.jsx";

let SelectContext=createContext();

export function Select({value, children, render, class: className}) {
	children=useExpandChildren(children);
	let valueVar=useVarExpr(value);

	let selectContextValue={
		render: render,
		value: value
	};

	if (render=="custom") {
		return (
			<SelectContext.Provider value={selectContextValue}>
				<div class={className}>
					{children}
				</div>
			</SelectContext.Provider>
		);
	}

	else {
		return (
			<SelectContext.Provider value={selectContextValue}>
				<select class={className}
						value={valueVar.get()}
						onChange={ev=>valueVar.set(ev.target.value)}>
					{children}
				</select>
			</SelectContext.Provider>
		);
	}
}

Select.editorPreview=({display, children, class: className})=><div style={{display}} class={className}>{children}</div>;
Select.styling=true;
Select.category="Logic";
Select.materialSymbol="list";
Select.containerType="children";
Select.controls={
	value: {type: "expr"},
	render: {type: "select", options: ["dropdown","custom"]},
}

export function Option({value, children}) {
	let valueVar=useVarExpr(value);
	let selectContextValue=useContext(SelectContext);
	let selectValueVar=useVarExpr(selectContextValue.value);
	let selectedVar=useNewVar();

	if (selectContextValue.render=="custom") {
		selectedVar.set(valueVar.get()==selectValueVar.get());
		//console.log("selected: "+selectedVar.get());

		function select() {
			selectValueVar.set(valueVar.get());
		}

		return (
			<Env varStates={{selected: selectedVar}} actions={{select}}>
				{children}
			</Env>
		);
	}

	else {
		return (
			<option value={valueVar.get()}>
				{children}
			</option>
		);
	}
}

Option.editorPreview=({display, children})=><div style={{display}}>{children}</div>;
Option.materialSymbol="tv_options_edit_channels";
Option.category="Logic";
Option.containerType="children";
Option.controls={
	value: {type: "expr"}
};
Option.envSpec={
	selected: {},
	select: {type: "action"}
};