export default class Tokenizer {
	constructor(tokenClasses) {
		this.tokenClasses=tokenClasses;
		this.tokenOptions={};
	}

	setTokenOptions(tokenOptions) {
		this.tokenOptions=tokenOptions;
	}

	tokenize(s) {
		let tokens=[];

		while (s.length) {
			let token, tokenMatch;
			for (let k in this.tokenClasses) {
				if (typeof this.tokenClasses[k]=="string") {
					if (s.startsWith(this.tokenClasses[k])) {
						tokenMatch=this.tokenClasses[k];
						token={
							type: k,
							value: this.tokenClasses[k]
						};

						break;
					}
				}

				else {
					let match=s.match(this.tokenClasses[k]);
					if (match && match.index==0) {
						//console.log(match);
						tokenMatch=match[0];
						token={
							type: k,
							value: match[match.length-1]
						};

						break;
					}
				}
			}

			if (!token)
				throw new Error("Parse error at: "+s);

			if (this.tokenOptions[token.type]) {
				let options=this.tokenOptions[token.type];
				if (options.unescapeBackslash)
					token.value=token.value.replace(/(?:\\(.))/g, '$1');
			}

			tokens.push(token);

			s=s.slice(tokenMatch.length);
		}

		return tokens;
	}
}