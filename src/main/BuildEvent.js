import {PluginEvent} from "../utils/plugins.js";

export default class BuildEvent extends PluginEvent {
	constructor() {
		super("build");

		this.serverModules=[];
		this.clientWrappers=[];
	}

	addServerModule(fullPath) {
		this.serverModules.push(fullPath);
	}

	addClientWrapper(fullPath) {
		this.clientWrappers.push(fullPath);
	}
}