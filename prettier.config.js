/** @type {import("prettier").Config} */
const config = {
	useTabs: true,
	semi: false,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 120,
	plugins: ['prettier-plugin-svelte'],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }]
}

export default config
