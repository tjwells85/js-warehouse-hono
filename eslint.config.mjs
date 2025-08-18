import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: ['build/', 'node_modules/', '**/*.gen.ts'],
	},
	{
		files: ['**/*.{js,ts,jsx,tsx}'],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	js.configs.recommended,
	...ts.configs.recommended,
	eslintConfigPrettier,
	{
		rules: {
			'@typescript-eslint/no-unused-vars': 'warn',
		},
	},
];
