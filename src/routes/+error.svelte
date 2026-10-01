<script lang="ts">
	import { page } from '$app/state'
</script>

<svelte:head>
	<title>{page.status} | markdown-svelte</title>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<header class="page-header">
	<h1>{page.status === 404 ? 'Page not found' : 'Something went wrong'}</h1>
	<p>
		{page.status}: {page.status === 404
			? 'This page may have moved, or the address may be incorrect.'
			: (page.error?.message ?? 'Please try again later.')}
	</p>
	<p>Return to the <a href="/">playground</a> or explore the <a href="/docs/">documentation</a>.</p>
</header>
