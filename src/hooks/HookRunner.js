import HookEvent from "./HookEvent.js";

export default class HookRunner {
	constructor() {
		this.listeners={};
	}

	addListener(type, listener) {
		if (!this.listeners[type])
			this.listeners[type]=[];

		if (!listener.priority)
			listener.priority=10;

		this.listeners[type].push(listener);
		this.listeners[type].sort((a,b)=>a.priority-b.priority);
	}

	addListenerModule(mod) {
		for (let name in mod)
			if (!["default"].includes(name)) {
				let event=name;
				if (mod[name].event)
					event=mod[name].event;

				this.addListener(event,mod[name]);
			}
	}

	async dispatch(hookEvent, options={}) {
		/*if (!(hookEvent instanceof HookEvent))
			throw new Error("Event should be hook event");*/

		if (hookEvent.target && hookEvent.target!=this)
			throw new Error("Event used with different dispatcher");

		hookEvent.target=this;

		let listeners=[];
		if (this.listeners[hookEvent.type])
			listeners=[...this.listeners[hookEvent.type]];

		if (options.concurrent) {
			let priorityGroups={};
			for (let listener of listeners) {
				if (!priorityGroups[listener.priority])
					priorityGroups[listener.priority]=[];

				priorityGroups[listener.priority].push(listener)
			}

			for (let priority in priorityGroups) {
				let groupListeners=priorityGroups[priority];
				let promises=groupListeners.map(l=>l(hookEvent));
				await Promise.all(promises);
			}
		}

		else {
			let res;
			for (let listener of listeners) {
				res=await listener(hookEvent);
				if (res)
					break;
			}

			return res;
		}
	}
}