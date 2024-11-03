import Tokenizer from "../src/utils/Tokenizer.js";

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

		expect(t.tokenize(/*undefined*/)).toEqual([]);

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
});