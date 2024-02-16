import {objectifyArgs} from "../utils/js-util.js";

class CliCommad {
	constructor({name, description}) {
		this.name=name;
		this.description=description;
		this.options=[];
	}
}

class CliOption {
	constructor(conf) {
		Object.assign(this,conf);
	}

	getHelpLine() {
		let s="  --"+this.name;
		if (this.type!="boolean")
			s+="=...";

		s=s.padEnd(20)+this.description;
		if (this.default)
			s+=" Default: "+this.default;

		return s;
	}

	populateDefault(argv) {
		if (!argv.hasOwnProperty(this.name))
			argv[this.name]=this.default;
	}
}

export default class CliSpec {
	constructor() {
		this.commands=[];
		this.globalOptions=[];
	}

	addCommand(...args) {
		let conf=objectifyArgs(args,["name","description"]);
		this.commands.push(new CliCommad(conf));
	}

	addCommandOption(...args) {
		let conf=objectifyArgs(args,["command","name","description"]);
		this.getCommandByName(conf.command).options.push(new CliOption(conf));
	}

	addGlobalOption(...args) {
		let conf=objectifyArgs(args,["name","description"]);

		let optionsByName=Object.fromEntries(this.globalOptions.map(o=>[o.name,o]));
		if (optionsByName[conf.name])
			return;

		this.globalOptions.push(new CliOption(conf));
	}

	printUsage(commandName) {
		let command=this.getCommandByName(commandName);
		if (command)
			return this.printCommandUsage(commandName);

		console.log("Usage:");
		console.log("  katnip <command> [options]");
		console.log();
		console.log("Commands:")
		for (let command of this.commands) {
			console.log(("  katnip "+command.name).padEnd(20)+command.description);
		}

		if (this.globalOptions.length) {
			console.log();
			console.log("Global Options:")
			for (let option of this.globalOptions)
				console.log(option.getHelpLine());
		}

		console.log();
	}

	printCommandUsage(commandName) {
		let command=this.getCommandByName(commandName);
		console.log(command.description);
		console.log();
		console.log("Usage:");
		console.log("  katnip "+command.name+" [options]");
		if (command.options.length) {
			console.log();
			console.log("Options:")
			for (let option of command.options)
				console.log(option.getHelpLine());
		}
		console.log();
	}

	checkArgv(argv) {
		if (argv._.length!=1 || 
				!this.isCommand(argv._[0]) ||
				argv.help) {
			this.printUsage(argv._[0]);
			return false;
		}

		let options=[...this.globalOptions];
		if (argv._[0])
			options=[
				...options,
				...this.getCommandByName(argv._[0]).options
			];

		let optionsByName=Object.fromEntries(options.map(o=>[o.name,o]));
		for (let k in argv)
			if (k!="_" && !optionsByName[k]) {
				console.log("Unknown option: "+k);
				console.log();
				this.printUsage(argv._[0]);
				return false;
			}

		return true;
	}

	isCommand(name) {
		for (let command of this.commands)
			if (command.name==name)
				return true;
	}

	getCommandByName(name) {
		for (let command of this.commands)
			if (command.name==name)
				return command;
	}

	getBooleanArgs() {
		let boolean=[];

		for (let option of this.globalOptions)
			if (option.type=="boolean")
				boolean.push(option.name);

		for (let command of this.commands)
			for (let option of command.options)
				if (option.type=="boolean")
					boolean.push(option.name);
	}

	populateDefault(argv) {
		for (let option of this.globalOptions)
			option.populateDefault(argv);

		if (argv._[0]) {
			let command=this.getCommandByName(argv._[0]);
			for (let option of command.options)
				option.populateDefault(argv);
		}
	}
}