import HookEvent from "./HookEvent.js";

export class BuildEvent extends HookEvent {
	constructor({options, platform, fs, cwd}) {
		if (!options)
			throw new Error("options must be passed to build event!");

		if (!platform)
			throw new Error("platform must be passed to build event!");

		if (!fs)
			throw new Error("fs must be passed to build event!");

		if (!cwd)
			throw new Error("cwd must be passed to build event!");

		super("build",{options, platform, fs, cwd})
		this.importModules={};
		this.data={};
	}
}

export default BuildEvent;