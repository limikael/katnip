export default class HookEvent {
	constructor(type, options={}) {
		Object.assign(this,options);
		this.type=type;
	}

	stopPropagation() {
		this.propagationStopped=true;
	}

	clone() {
		let newEvent={...this};
		delete newEvent.propagationStopped;
		delete newEvent.hookRunner;
		delete newEvent.listeners;

		return new HookEvent(this.type,newEvent);
	}

	async runRemaining() {
		let newEvent=this.clone();

		return await newEvent.run(this.hookRunner,[...this.listeners]);
	}

	async run(hookRunner, listeners) {
		if (this.listeners)
			throw new Error("event already run");

		this.hookRunner=hookRunner;
		this.listeners=listeners;
		this.propagationStopped=false;

		let ret;
		while (this.listeners.length && !this.propagationStopped) {
			let listener=this.listeners.shift();
			if (this.listenerParameters)
				ret=await listener(...this.listenerParameters);

			else
				ret=await listener(this);

			if (ret)
				return ret;
		}
	}
}