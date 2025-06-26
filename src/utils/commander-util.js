export function withProgramOptions(program, handler) {
	return (options=>handler({...program.opts(),...options}));
}