import Tokenizer from "../src/utils/Tokenizer.js";
import {ExpressionParser, TemplateLiteralParser} from "../src/nocode/parser.js";

describe("tokenizer",()=>{
	it("can tokenize",()=>{
		//let s="hello $world test";
		let s='hello $world $a:b[$test], test';

		let t=new Tokenizer({
			literal: /(?:[^$\\]|\\.)+/,
			expr: /(\$[A-Za-z0-9\[\]:\$]+)\\?/
		});

		t.setTokenOptions({
			literal: {unescapeBackslash: true}
		})

		let tokens=t.tokenize(s);
		expect(tokens.length).toEqual(5);
		//console.log(t.tokenize(s));
	});

	it("can use plain strings as matchers",()=>{
		let s='$hello[world]';
		let t=new Tokenizer({
			dollar: "$",
			id: /[A-Za-z0-9_]+/,
			left_bracket: "[",
			right_bracket: "]",
			//colon: ":",
			//dot: "."
		});

		let tokens=t.tokenize(s);
		expect(tokens.length).toEqual(5);
		//console.log(t.tokenize(s));
	});

	it("can parse expressions",()=>{
		let exParser=new ExpressionParser();

		let ast=exParser.parse("$hello[$i[5]][world]");
		//console.log(JSON.stringify(ast/*,null,2*/));
		expect(ast).toEqual({"type":"expr","var":"hello","ref":[{"type":"expr","var":"i","ref":[{"type":"field","name":"5"}]},{"type":"field","name":"world"}]});
	});

	it("can parse template literals",()=>{
		let tplParser=new TemplateLiteralParser();

		//let ast=tplParser.parse("hello $name, how are you?");
		let ast=tplParser.parse("hello $people[$id][name], how are you?");
		expect(ast).toEqual({"type":"concat","parts":[{"type":"literal","value":"hello "},{"type":"expr","var":"people","ref":[{"type":"expr","var":"id","ref":[]},{"type":"field","name":"name"}]},{"type":"literal","value":", how are you?"}]});
		//console.log(JSON.stringify(ast))//,null,2));
	});
});