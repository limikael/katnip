export default class EnvBakeMode {
	constructor(mode, value) {
		if (!["never","different"].includes(mode))
			throw new Error("bake env mode");

		this.mode=mode;
		this.value=value;
	}
}