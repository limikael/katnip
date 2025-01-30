import HookEvent from "../hooks/HookEvent.js";
import {getCommandByName} from "../utils/commander-util.js";

export {
	InitCliEvent,
	InitCliEvent as default
}

/**
 * This event is sent when the command line is started.
 * 
 * It is used by plugins to register available commands.
 * 
 * @extends HookEvent
 */
class InitCliEvent extends HookEvent {
	constructor(katnipCli) {
		super("initCli");

		this.katnipCli=katnipCli;

		/**
		 * An instance of a [Commander](https://www.npmjs.com/package/commander)
		 * command where extra commands can be added.
		 */
		this.program=katnipCli.program;
	}

	getProgramSpec() {
		return this.program;
	}

	getCommandSpec(name) {
		return getCommandByName(this.program,name);
	}

	getOptionSpec(commandName, optionName) {
		let command=getCommandByName(this.program,commandName);
		for (let option of command.options)
			if (option.long=="--"+optionName)
				return option;
	}
}