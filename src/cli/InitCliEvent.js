import HookEvent from "../hooks/HookEvent.js";
import {getCommandByName} from "../utils/commander-util.js";

export default class InitCliEvent extends HookEvent {
	constructor(katnipCli) {
		super("initCli");

		this.katnipCli=katnipCli;
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