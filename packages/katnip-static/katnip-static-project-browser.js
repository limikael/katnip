build.priority=5;
export function build(ev) {
	if (!ev.options.publicDir)
		ev.options.publicDir="public";
}