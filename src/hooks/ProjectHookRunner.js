import HookRunner from "./HookRunner.js";

export {
	ProjectHookRunner,
	ProjectHookRunner as default
}

/**
 * Serves as the event target for all events dispatched during the project phase.
 */
class ProjectHookRunner extends HookRunner {
	constructor() {
		super();
	}

	/**
	 * Get the working directory where the project is run.
	 */
	cwd() {
		throw new Error("Abstract");
	}
}