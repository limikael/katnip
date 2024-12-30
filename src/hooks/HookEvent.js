export default class HookEvent {
	constructor(type, init={}) {
		Object.assign(this,init);
		this.type=type;
	}
}