import HookEvent from "./HookEvent.js";

export class BuildEvent extends HookEvent {
	constructor({options, platform}) {
		if (!options)
			throw new Error("options must be passed to build event!");

		if (!platform)
			throw new Error("platform must be passed to build event!");

		super("build",{options, platform})
		this.importModules={};
		this.data={};
	}
}

export default BuildEvent;