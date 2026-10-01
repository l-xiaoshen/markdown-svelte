<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public'
	import Playground from './_components/Playground.svelte'
	import Seo from './_components/Seo.svelte'

	const description =
		'A typed Markdown renderer for Svelte 5 with native components, smooth streaming, and customizable styles.'
	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': new URL('/#website', PUBLIC_BASE_URL).href,
				name: 'markdown-svelte',
				url: new URL('/', PUBLIC_BASE_URL).href,
				description,
				inLanguage: 'en'
			},
			{
				'@type': 'SoftwareSourceCode',
				'@id': new URL('/#library', PUBLIC_BASE_URL).href,
				name: 'markdown-svelte',
				url: new URL('/docs/', PUBLIC_BASE_URL).href,
				description,
				codeRepository: 'https://github.com/l-xiaoshen/markdown-svelte',
				programmingLanguage: 'TypeScript',
				runtimePlatform: 'Svelte 5',
				license: 'https://spdx.org/licenses/MIT.html',
				image: new URL('/icon-512.png', PUBLIC_BASE_URL).href
			}
		]
	}).replace(/</g, '\\u003c')
</script>

<Seo
	title="markdown-svelte | Markdown renderer for Svelte 5"
	description="Render Markdown with typed Svelte 5 components. Try smooth streaming and instant previews, explore examples, and learn the API."
	path="/"
/>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<Playground />
