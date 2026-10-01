<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public'

	interface Props {
		title: string
		description: string
		path: string
	}

	let { title, description, path }: Props = $props()

	const canonical = $derived(new URL(path, PUBLIC_BASE_URL).href)
	const image = new URL('/social-card.png', PUBLIC_BASE_URL).href
	const imageAlt = 'markdown-svelte — Markdown for Svelte 5. Typed components. Smooth streaming.'
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="markdown-svelte" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={image} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={imageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={imageAlt} />
</svelte:head>
