export class AsyncEvent {
	constructor(type, init={}) {
		Object.assign(this,init);
		this.type=type;
		this.target=undefined;
	}
}

/**
 * For running hooks.
 * 
 * This is similar to the starnard JavaScript EventTarget class, with a few
 * differences. It can dispatch async events.
 */
export class AsyncEventTarget {
	constructor() {
		this.listeners={};
	}

	/**
	 * Add hook listener.
	 * @param type The hook event to listen to.
	 * @param listener The function to call when the event triggers.
	 */
	addEventListener(type, listener, {priority}={}) {
		if (!this.listeners[type])
			this.listeners[type]=[];

		if (priority)
			listener.priority=priority;

		if (!listener.priority)
			listener.priority=10;

		this.listeners[type].push(listener);
		this.listeners[type].sort((a,b)=>a.priority-b.priority);
	}

	/**
	 * Adds all exported functions from the module as listeners.
	 * Each function will be added as a listener to the event
	 * corresponding to the name of the function.
	 * 
	 * @param mod the module to add listeners from
	 */
	addListenerModule(mod) {
		for (let name in mod)
			if (!["default"].includes(name)) {
				let event=name;
				if (mod[name].event)
					event=mod[name].event;

				this.addEventListener(event,mod[name]);
			}
	}

	/**
	 * Dispatch a hook event. Note that this is an async function. 
	 * The event listeners will be run in order of priority. If
	 * the concurrent parameter is set, they will be run in parallel,
	 * otherwise sequentially.
	 * 
	 * @async
	 * @param {HookEvent} hookEvent The event to dispatch.
	 * @param {Object} options
	 * @param options.concurrent Weather to run events in parallel.
	 */
	async dispatchEvent(hookEvent, options={}) {
		/*if (!(hookEvent instanceof HookEvent))
			throw new Error("Event should be hook event");*/

		if (hookEvent.target && hookEvent.target!=this)
			throw new Error("Event used with different dispatcher");

		hookEvent.target=this;

		let listeners=[];
		if (this.listeners["*"])
			listeners.push(...this.listeners["*"]);

		if (this.listeners[hookEvent.type])
			listeners.push(...this.listeners[hookEvent.type]);

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
