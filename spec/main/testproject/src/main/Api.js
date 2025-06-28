export default class Api {
	constructor(ev) {
		this.ev=ev;
	}

	async testFunc(val) {
		return ("it worked: "+val);
	}
}