import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';

export default defineConfig({
	plugins: [pluginReact()],
	tools: {
		rspack: {
			plugins: [TanStackRouterRspack()],
		},
	},
	server: {
		port: 5000,
		proxy: {
			'/api': 'http://localhost:3000',
		},
	},
});
