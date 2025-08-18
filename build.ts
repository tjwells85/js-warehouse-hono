await Bun.build({
	entrypoints: ['server/server.ts'],
	target: 'bun',
	outdir: './build',
	sourcemap: 'external',
	env: 'inline',
	// bytecode: true,
});

export default {};
