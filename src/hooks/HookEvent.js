export {
	HookEvent,
	HookEvent as default
}

/**
 * Base class for events dispatched using the HookRunner class.
 */
class HookEvent {
	constructor(type, init={}) {
		Object.assign(this,init);
		this.type=type;

		/**
		 * An instance of HookRunner where the event is dispatched.
		 * 
		 * @type HookRunner
		 */
		this.target=undefined;
	}
}