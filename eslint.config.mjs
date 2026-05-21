import js from '@eslint/js';
import json from '@eslint/json';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import pluginCypress from 'eslint-plugin-cypress';

export default defineConfig([
	{ ignores: ['package-lock.json'] },
	{
		files: ['cypress/**/*.js'],
		extends: [pluginCypress.configs.recommended],
		languageOptions: {
			sourceType: 'script',
		},
		rules: {
			'cypress/unsafe-to-chain-command': 'warn',
		},
	},
	{
		files: ['**/*.{js,mjs,cjs}'],
		plugins: { js },
		extends: ['js/recommended'],
		languageOptions: {
			globals: {
				require: 'readonly',
				module: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
			},
		},
	},
	{ files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
	{ files: ['**/*.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
	eslintConfigPrettier,
]);
