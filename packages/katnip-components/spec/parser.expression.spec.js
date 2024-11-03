import {ExpressionParser} from "../src/nocode/parser.js";

describe("tokenizer",()=>{
	it("can parse expressions",()=>{
		let exParser=new ExpressionParser();

		let ast=exParser.parse("hello.world");
		expect(ast).toEqual({"type":"expr","var":"hello",ref:[{type:"field",value:"world"}]});

		let ast2=exParser.parse("hello[world[bla]].test");
		//console.log(JSON.stringify(ast2));
		expect(JSON.stringify(ast2)).toEqual('{"type":"expr","var":"hello","ref":[{"type":"expr","var":"world","ref":[{"type":"expr","var":"bla","ref":[]}]},{"type":"field","value":"test"}]}');

		//let ast2=exParser.parse("$hello:world");
		//expect(ast2).toEqual({ type: 'expr', var: 'hello', namespace: 'world', ref: [] });
		//console.log(ast2);
	});
});