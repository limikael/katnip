import {parse as parseXml} from "txml/txml";
import {xmlMap} from "./xml-util.js";
import {isStringy} from "./js-util.js";

function escapeXml(unsafe) {
    return unsafe.toString().replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function escapeXmlAttr(unsafe) {
    return unsafe.toString().replace(/[<>&'"\n\r\t]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            case "\n": return "&#xA;";
            case "\r": return "&#xD;";
            case "\t": return "&#x9;";
        }
    });
}

function escapeSpace(space) {
	if (space==" ")
		return "&nbsp;";

	return "&#"+space.charCodeAt(0)+";";
}

function initOptions(options) {
	if (!options)
		options={};

	if (options.pretty===undefined)
		options.pretty=true;

	if (!options.indent)
		options.indent=2;

	if (!options.level)
		options.level=0;

	return options;
}

function optionsPrettyIndent(options) {
	if (!options.pretty)
		return "";

	return " ".repeat(options.level*options.indent);
}

function optionsPrettyNewline(options) {
	return (options.pretty?"\n":"");
}

export function txmlStringify(node, options) {
	options=initOptions(options);

	if (isStringy(node)) {
		node=escapeXml(node);

		if ((options.pretty && "\n\t ".includes(node[0])) ||
				(!options.pretty && node.match(/^\s*/)[0].includes("\n")))
			node=escapeSpace(node[0])+node.slice(1);

		if ((options.pretty && "\n\t ".includes(node[node.length-1])) ||
				(!options.pretty && node.match(/\s*$/)[0].includes("\n")))
			node=node.slice(0,node.length-1)+escapeSpace(node[node.length-1]);

		if (options.pretty)
			return " ".repeat(options.level*options.indent)+node+"\n";

		return node;
	}

	if (Array.isArray(node))
		return node.map(n=>txmlStringify(n,options)).join("");

	let attr="";
	for (let k in node.attributes)
		attr+=" "+k+'="'+escapeXmlAttr(node.attributes[k])+'"';

	let s=optionsPrettyIndent(options);
	if (node.children.length) {
		s+="<"+node.tagName+attr+">";
		s+=optionsPrettyNewline(options);
		s+=txmlStringify(node.children,{...options, level: options.level+1});
		s+=optionsPrettyIndent(options);
		s+="</"+node.tagName+">";
	}

	else {
		s+="<"+node.tagName+attr+"/>";
	}

	s+=optionsPrettyNewline(options);

	return s;
}

function unescapeXmlEntities(s) {
	if (!s)
		return "";

	s=s.toString();

	s=s.replace(/&[A-Za-z]+;/g,c=>{
		let entities={
			"&lt;": "<",
			"&gt;": ">",
			"&amp;": "&",
			"&apos;": "'",
			"&quot;": '"',
			"&nbsp;": " "
		};

		if (entities[c])
			return entities[c];
	});

	s=s.replace(/&#x[A-Za-z0-9]+;/,c=>{
		let hexCode=c.match(/&#x([A-Za-z0-9]+);/)[1];
		return String.fromCharCode(parseInt(hexCode,16)); 
	});

	s=s.replace(/&#[0-9]+;/,c=>{
		let code=c.match(/&#([0-9]+);/)[1];
		return String.fromCharCode(parseInt(code)); 
	});

	return s;
}

export function txmlParse(s) {
	let xml=parseXml(s,{keepWhitespace: true});

	//console.log(JSON.stringify(xml));

	return xmlMap(xml,node=>{
		if (isStringy(node)) {
			if (!node.trim())
				return;

			if (node.match(/^\s*/)[0].includes("\n"))
				node=node.trimStart();

			if (node.match(/\s*$/)[0].includes("\n"))
				node=node.trimEnd();

			node=unescapeXmlEntities(node);
		}

		else {
			if (!node.tagName)
				throw new Error("Empty tag name");

			if (node.tagName.match(/[<>&'"]/))
				throw new Error("Bad chars in tag name: "+node.tagName);

			for (let k in node.attributes)
				node.attributes[k]=unescapeXmlEntities(node.attributes[k]);
		}

		return node;
	});
}
