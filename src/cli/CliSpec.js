import {objectifyArgs} from "../utils/js-util.js";
import HookEvent from "../hooks/HookEvent.js";
import path from "path";
import {fileURLToPath} from 'url';
import fs from "fs";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

class CliCommad {
	constructor({name, description, preCommand, projectMode, cli, inheritOptions}) {
		if (projectMode===undefined)
			projectMode=true;

		if (cli===undefined)
			cli=true;

		this.inheritOptions=inheritOptions;
		this.cli=cli;
		this.name=name;
		this.description=description;
		this.options=[];
		//this.preCommand=preCommand;
		this.projectMode=projectMode;
	}

	/*getPreCommand(options) {
		if (!this.preCommand)
			return;

		if (typeof this.preCommand=="function")
			return this.preCommand(options);

		return this.preCommand;
	}*/

	getPositionalOptions() {
		let positionalOptions=[];
		for (let option of this.options)
			if (option.positional)
				positionalOptions.push(option);

		return positionalOptions;
	}
}

class CliOption {
	constructor(conf) {
		Object.assign(this,conf);
	}

	getHelpLine() {
		let s;

		if (this.positional) {
			s="  "+this.name;
		}

		else {
			s="  --"+this.name;
			if (this.type!="boolean")
				s+="=...";
		}

		s=s.padEnd(22)+this.description;
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
	constructor({projectMode}) {
		this.commands=[];
		this.globalOptions=[];
		this.projectMode=projectMode;
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
		if (!this.projectMode) {
			console.log("Note:")
			console.log("  Not in project mode, functionality is limited.");
			console.log();
		}

		console.log("Commands:")
		for (let command of this.commands) {
			if (this.projectMode==command.projectMode &&
					command.cli)
				console.log(("  katnip "+command.name).padEnd(22)+command.description);
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
		let positionalOptions=command.getPositionalOptions();
		console.log(command.description);
		console.log();
		console.log("Usage:");
		console.log("  katnip "+command.name+
			positionalOptions.map(o=>` <${o.name}>`).join()+
			" [options]");
		if (positionalOptions.length) {
			console.log();
			console.log("Arguments:")
			for (let option of command.options)
				if (option.positional)
					console.log(option.getHelpLine());
		}
		if (command.options.length || command.inheritOptions) {
			console.log();
			console.log("Options:")
			for (let option of command.options)
				if (!option.positional)
					console.log(option.getHelpLine());

			if (command.inheritOptions) {
				let inheritedCommand=this.getCommandByName(command.inheritOptions);
				for (let option of inheritedCommand.options)
					if (!option.positional)
						console.log(option.getHelpLine());
			}
		}

		console.log();
	}

	parseArgv(argv) {
		if (argv.version) {
			let packageJsonPath=path.join(__dirname,"../../package.json");
			let packageJson=JSON.parse(fs.readFileSync(packageJsonPath,"utf8"));
			console.log("Katnip version: "+packageJson.version);
			return;
		}

		if (argv._[0]=="help") {
			argv.help=true;
			argv._.shift();
		}

		if (argv._.length<1 || 
				argv.help) {
			this.printUsage(argv._[0]);
			return;
		}

		if (!this.isCommand(argv._[0])) {
			console.log("Unknown command: "+argv._[0]);
			console.log();
			this.printUsage(argv._[0]);
			return;
		}


		let options=[...this.globalOptions];
		if (argv._[0])
			options=[
				...options,
				...this.getCommandByName(argv._[0]).options
			];

		let cmd=this.getCommandByName(argv._[0]);
		if (cmd.inheritOptions) {
			cmd=this.getCommandByName(cmd.inheritOptions)
			options=[...options,...cmd.options];
		}

		let optionsByName=Object.fromEntries(options.map(o=>[o.name,o]));
		for (let k in argv)
			if (k!="_" && !optionsByName[k]) {
				console.log("Unknown option: "+k);
				console.log();
				this.printUsage(argv._[0]);
				return;
			}

		let ret={...argv};
		for (let option of options) {
			if (option.positional && ret._.length>1) {
				ret[option.name]=ret._[1];
				ret._=[ret._[0],...ret._.slice(2)];
			}
		}

		if (ret._.length!=1) {
			console.log("Unknown arguments: "+ret._.slice(1).join(" "));
			console.log();
			this.printUsage(argv._[0]);
			return;
		}

		return ret;
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

	getBooleanOptions() {
		let booleanOptions=[];

		for (let option of this.globalOptions)
			if (option.type=="boolean")
				booleanOptions.push(option.name);

		for (let command of this.commands)
			for (let option of command.options)
				if (option.type=="boolean")
					booleanOptions.push(option.name);

		return booleanOptions;
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