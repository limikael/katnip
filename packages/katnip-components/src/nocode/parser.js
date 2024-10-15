import Tokenizer from "../utils/Tokenizer.js";

export class TemplateLiteralParser {
	constructor() {
		this.tokenizer=new Tokenizer({
			literal: /(?:[^$\\]|\\.)+/,
			expr: /(\$[A-Za-z0-9\[\]:\$]+)\\?/
		});

		this.tokenizer.setTokenOptions({
			literal: {unescapeBackslash: true}
		})

		this.expressionParser=new ExpressionParser();
	}

	parse(s) {
		this.tokens=this.tokenizer.tokenize(s);
		this.position=0;

		return this.parseExpressionOrConcat();
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
			dollar: "$",
			id: /[A-Za-z0-9_]+/,
			left_bracket: "[",
			right_bracket: "]",
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
		if (token.type===type) {
			this.nextToken();
			return token.value;
		} 

		else {
			throw new Error(`Expected token type ${type}, but got ${token.type}`);
		}
	}

	parseExpression() {
		if (this.match("dollar")) {
			this.nextToken();
			let variable=this.consume("id");

			return ({
				type: "expr",
				var: variable,
				ref: this.parseRef()
			});
		}

		else throw new Error("Expeced $ at beginning of expr.");
	}

	parseRef() {
		let res=[];

		while (this.match("left_bracket")) {
			this.consume("left_bracket");
			if (this.match("dollar")) {
				res.push(this.parseExpression());
			}

			else if (this.match("id")) {
				res.push({
					type: "field",
					name: this.consume("id"),
				})
			}

			else throw new Error("Expected expr of field.");

			this.consume("right_bracket");
		}

		return res;
	}
}