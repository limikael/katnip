import Tokenizer from "../src/utils/Tokenizer.js";
import {ExpressionParser, TemplateLiteralParser, parseComponentExpr} from "../src/nocode/parser.js";

describe("parser",()=>{
	it("can tokenize template literals",()=>{
		//let s="hello $world test";
		//let s='hello {world} {a.b[test]}, test';

		let parser=new TemplateLiteralParser();

		let tokens=parser.tokenizer.tokenize("hello \\{world} {a.b[test]}, test");
		expect(tokens).toEqual([
			{ type: 'literal', value: 'hello {world} ' },
			{ type: 'expr', value: 'a.b[test]' },
			{ type: 'literal', value: ', test' }
		]);
	});

	it("can parse template literals",()=>{
		let tplParser=new TemplateLiteralParser();

		let ast=tplParser.parse("hello {name}, how are you?");
		//console.log(JSON.stringify(ast));
		expect(ast).toEqual({"type":"concat","parts":[{"type":"literal","value":"hello "},{"type":"expr","var":"name","ref":[]},{"type":"literal","value":", how are you?"}]});

		let ast2=tplParser.parse("hello {people[id].name}, how are you?");
		//console.log(JSON.stringify(ast2));
		expect(ast2).toEqual({"type":"concat","parts":[{"type":"literal","value":"hello "},{"type":"expr","var":"people","ref":[{"type":"expr","var":"id","ref":[]},{"type":"field","value":"name"}]},{"type":"literal","value":", how are you?"}]});
	});

	it("can parse a declarationName",()=>{
		let declarationName=parseComponentExpr("{a}",{grammar: "declarationName"});
		expect(declarationName).toEqual("a");

		let declarationName2=parseComponentExpr("a",{grammar: "declarationName"});
		expect(declarationName2).toEqual("a");

		let declarationName3=parseComponentExpr(undefined,{grammar: "declarationName"});
		expect(declarationName3).toEqual(undefined);

		let declarationName4=parseComponentExpr(" ",{grammar: "declarationName"});
		expect(declarationName4).toEqual(undefined);

		let declarationName5=parseComponentExpr("",{grammar: "declarationName"});
		expect(declarationName5).toEqual(undefined);
	});

	it("can make sure something is assignable",()=>{
		let tplParser=new TemplateLiteralParser();
		let ast=tplParser.parse("{var}");
		expect(ast).toEqual({ type: 'expr', var: 'var', ref: [] });
		//console.log(ast);

		let ast2=tplParser.parse("var");
		expect(ast2).toEqual({ type: 'literal', value: 'var' });

		let ast3=tplParser.parse("var",{grammar: "assignable"});
		expect(ast3).toEqual({ type: 'expr', var: 'var', ref: [] });
		//console.log(ast3);

		let ast4=tplParser.parse("",{grammar: "assignable"});
		//console.log(ast4);
		expect(ast4).toBe(undefined);
	});

	it("can parse undefined",()=>{
		let tplParser=new TemplateLiteralParser();
		expect(tplParser.parse(undefined)).toEqual({type: "concat", parts: []});
		expect(tplParser.parse(undefined,{grammar: "assignable"})).toEqual(undefined);
	});
});