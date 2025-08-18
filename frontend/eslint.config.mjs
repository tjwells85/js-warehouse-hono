import base from '../eslint.config.mjs';
import react from 'eslint-plugin-react/configs/recommended.js';
import reactJsx from 'eslint-plugin-react/configs/jsx-runtime.js';
import reactHooks from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.Config[]} */
export default [
	...base,
	{
		settings: {
			react: { version: 'detect' },
		},
	},
	react,
	reactJsx,
	{
		plugins: {
			'react-hooks': reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
		},
	},
	{
		ignores: ['dist/'],
	},
];
