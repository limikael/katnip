
function expandExports(exportDefs) {
	if (typeof exportDefs=="string")
		return [{conditions: [], import: ".", path: exportDefs}];

	let res=[];
	for (let k in exportDefs) {
		let childDefs=expandExports(exportDefs[k]);
		for (let def of childDefs)
			if (k.startsWith("."))
				def.import=k;

			else if (k!="default")
				def.conditions.push(k);

		res=[...res,...childDefs];
	}

	return res;
}

let exportsDef={
	".": "/test.js",
	"server": {
		"node": "./hello.js",
		"workerd": {
			".": "root.js",
			"./hello": "./hello.js"
		},
		"default": "def.js"
	}
}

console.log(expandExports(exportsDef));
