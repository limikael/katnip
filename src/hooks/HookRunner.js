import HookEvent from "./HookEvent.js";

export default class HookRunner {
	constructor() {
		this.listeners={};
	}

	addListenerModule(mod, options={}) {
		for (let funcName in mod) {
			if (!this.listeners[funcName])
				this.listeners[funcName]=[];

			let func=mod[funcName];
			if (!func.priority)
				func.priority=10;

			this.listeners[funcName].push(func);
			this.listeners[funcName].sort((a,b)=>a.priority-b.priority);
		}
	}

	getListenersByEventType(type) {
		let listeners=this.listeners[type];
		if (!listeners)
			listeners=[];

		return [...listeners];
	}

	async emit(event, ...listenerParameters) {
		if (typeof event=="string")
			event=new HookEvent(event, {listenerParameters});

		else {
			// Can't check because doesn't work with npm link
			/*if (!(event instanceof HookEvent))
				throw new Error("not hook event");*/

			if (listenerParameters.length)
				throw new Error("Event options only allowed if event is a string.");
		}

		return await event.run(this,this.getListenersByEventType(event.type));
	}
}