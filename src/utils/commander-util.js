export function parseCommand(program, argv) {
	let foundAction;
	function actionHandler() {
		foundAction=this;
	}

	for (let c of program.commands)
		c.action(actionHandler)

	program.parse(argv);
	if (!foundAction)
		program.help();

	if (foundAction.registeredArguments.length!=foundAction.args.length)
		foundAction.help();

	return foundAction;
}

export function getCommandByName(program, commandName) {
	for (let c of program.commands)
		if (c._name==commandName)
			return c;
}