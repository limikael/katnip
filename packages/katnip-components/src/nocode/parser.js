import Tokenizer from "../utils/Tokenizer.js";

export class TemplateLiteralParser {
	constructor() {
		this.tokenizer=new Tokenizer({
			literal: /(?:[^{\\]|\\.)+/,
			expr: /{([^}]*)}/,
		});

		this.tokenizer.setTokenOptions({
			literal: {unescapeBackslash: true}
		})

		this.expressionParser=new ExpressionParser();
	}

	makeExpr(ast) {
		//console.log("make expr",ast)

		switch (ast.type) {
			case "concat":
				if (!ast.parts.length)
					return;

				throw new Error("Not an assignable expression: "+s);
				break;

			case "expr":
				return ast;
				break;

			case "literal":
				if (!ast.value.trim())
					return;

				return ({
					type: "expr",
					var: ast.value.trim(),
					ref: []
				});
				break;

			default:
				throw new Error("Unknown expr type");
				break;
		}
	}

	parse(s, options={}) {
		//console.log("parse ",s);

		this.tokens=this.tokenizer.tokenize(s);
		this.position=0;

		//console.log("got tokens");

		if (!options.grammar)
			options.grammar="templateLiteral";

		let ast=this.parseExpressionOrConcat();
		//console.log("got ast..");

		switch (options.grammar) {
			case "declarationName":
				ast=this.makeExpr(ast);
				if (ast && ast.ref.length)
					throw new Error("Not a declaration");

				if (!ast)
					return;

				return ast.var;
				break;

			case "assignable":
				return this.makeExpr(ast);
				break;

			case "templateLiteral":
				return ast;
				break;

			default:
				throw new Error("Unknown grammar");
				break;
		}
	}

	currentToken() {
		return this.tokens[this.position];
	}

	nextToken() {
		this.position++;
	}

	match(type) {
		return this.currentToken() && this.currentToken().type===type;
	}

	consume(type) {
		let token=this.currentToken();
		if (token.type===type) {
			this.nextToken();
			return token.value;
		} 

		else {
			throw new Error(`Expected token type ${type}, but got ${token.type}`);
		}
	}

	parseExpressionOrConcat() {
		if (this.tokens.length==1)
			return this.parseLiteralOrExpression();

		let parts=[];
		while (this.position<this.tokens.length)
			parts.push(this.parseLiteralOrExpression());

		return ({
			type: "concat",
			parts: parts
		});
	}

	parseLiteralOrExpression() {
		if (this.match("literal")) {
			return ({
				type: "literal",
				value: this.consume("literal")
			});
		}

		else if (this.match("expr")) {
			return this.expressionParser.parse(this.consume("expr"));
		}

		else
			throw new Error("Expected literal or expression.");
	}
}

export class ExpressionParser {
	constructor() {
		this.tokenizer=new Tokenizer({
			id: /[A-Za-z0-9_]+/,
			left_bracket: "[",
			right_bracket: "]",
			dot: ".",
		})
	}

	parse(s) {
		this.tokens=this.tokenizer.tokenize(s);
		this.position=0;

		let res=this.parseExpression();
		if (this.position<this.tokens.length)
			throw new Error("Expected end of expr at: "+this.currentToken().value);
		return res;
	}

	currentToken() {
		return this.tokens[this.position];
	}

	nextToken() {
		this.position++;
	}

	match(type) {
		return this.currentToken() && this.currentToken().type===type;
	}

	consume(type) {
		let token=this.currentToken();
		if (!token)
			throw new Error("Unexpected end of input.");

		if (token.type===type) {
			this.nextToken();
			return token.value;
		} 

		else {
			throw new Error(`Expected token type ${type}, but got ${token.type}`);
		}
	}

	parseExpression() {
		if (!this.match("id"))
			throw new Error("Expected id.");

		let variable=this.consume("id");
		let ast={
			type: "expr",
			var: variable
		};

		ast.ref=this.parseRef();
		return ast;
	}

	parseRef() {
		let res=[];

		while (this.match("left_bracket") || this.match("dot")) {
			if (this.match("left_bracket")) {
				this.consume("left_bracket");
				res.push(this.parseExpression());
				this.consume("right_bracket");
			}

			else {
				this.consume("dot");
				res.push({
					type: "field",
					value: this.consume("id"),
				})
			}
		}

		return res;
	}
}

export function parseComponentExpr(exprString, options) {
	let tplParser=new TemplateLiteralParser();
	return tplParser.parse(exprString,options);
}