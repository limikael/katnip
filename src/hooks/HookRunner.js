import HookEvent from "./HookEvent.js";

export default class HookRunner {
	constructor() {
		this.listeners={};
	}

	on(event, func) {
		if (!this.listeners[event])
			this.listeners[event]=[];

		if (!func.priority)
			func.priority=10;

		this.listeners[event].push(func);
		this.listeners[event].sort((a,b)=>a.priority-b.priority);
	}

	addListenerModule(mod, options={}) {
		for (let funcName in mod) {
			if (!["registerHooks","default"].includes(funcName))
				this.on(funcName,mod[funcName]);

			/*if (!this.listeners[funcName])
				this.listeners[funcName]=[];

			let func=mod[funcName];
			if (!func.priority)
				func.priority=10;

			this.listeners[funcName].push(func);
			this.listeners[funcName].sort((a,b)=>a.priority-b.priority);*/
		}

		if (mod.registerHooks)
			mod.registerHooks(this);
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