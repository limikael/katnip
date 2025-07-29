export function extractJsonObject(text) {
	let match=text.match(/^{\s*\n[\s\S]*$/m);
	if (!match)
		throw new Error("Unable to parse json");

	return match[0];
}