build.priority=5;
export function build(ev) {
	console.log("*********** static build...");
	if (!ev.options.publicDir)
		ev.options.publicDir="public";
}