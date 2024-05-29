export function withEditorPreview(comp, alt) {
	if (!alt)
		alt=({children})=><>{children}</>;

	return ({renderMode, ...props})=>{
		if (renderMode=="editor")
			return alt(props);

		else
			return comp(props);
	}
}