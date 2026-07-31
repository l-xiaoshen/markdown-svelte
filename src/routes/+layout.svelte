<script lang="ts">
	import './app.css'

	let { children } = $props()
</script>

<svelte:head>
	<meta name="description" content="Documentation and examples for the markdown-svelte Svelte 5 Markdown renderer." />
</svelte:head>

<div class="site-shell">
	<header class="site-header">
		<div class="site-header-inner">
			<a class="site-brand" href="/">markdown-svelte</a>
			<nav class="site-nav" aria-label="Main navigation">
				<a href="/">API</a>
				<a href="/examples">Examples</a>
			</nav>
		</div>
	</header>

	<main class="site-main">
		{@render children()}
	</main>

	<footer class="site-footer">
		<p>markdown-svelte · Markdown rendering for Svelte 5</p>
	</footer>
</div>
