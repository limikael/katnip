export function initcli(spec) {
	spec.addGlobalOption("publicDir",{
		description: "Directory to serve as plain static assets.",
		default: "public"
	});
}