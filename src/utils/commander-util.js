import {Command} from 'commander';

export function parseEarlyOptions(earlyOptions) {
	const program = new Command();
	program
		.allowUnknownOption(true)
		.allowExcessArguments()
		.passThroughOptions();

	for (let earlyOption of earlyOptions)
	    program.option(earlyOption);

	program.parse(process.argv);

	return program;
}