<script lang="ts">
	import { page } from '$app/state'
	import './app.css'

	let { children } = $props()
</script>

<div class="site-shell">
	<header class="site-header">
		<div class="site-header-inner">
			<a class="site-brand" href="/" aria-label="markdown-svelte playground"
				><img class="brand-mark" src="/markdown-svelte-icon.svg" width="32" height="32" alt="" />markdown<span
					class="brand-svelte">-svelte</span
				></a
			>
			<nav class="site-nav" aria-label="Main navigation">
				<a href="/" aria-current={page.url.pathname === '/' || page.url.pathname === '/stream/' ? 'page' : undefined}
					>Playground</a
				>
				<a href="/docs/" aria-current={page.url.pathname.startsWith('/docs/') ? 'page' : undefined}>Docs</a>
				<a href="/examples/" aria-current={page.url.pathname === '/examples/' ? 'page' : undefined}>Examples</a>
			</nav>
		</div>
	</header>

	<main class="site-main" class:playground-main={page.url.pathname === '/' || page.url.pathname === '/stream/'}>
		{@render children()}
	</main>

	<footer class="site-footer">
		<p>markdown-svelte <span>·</span> Svelte 5</p>
		<a href="/docs/">Documentation</a>
	</footer>
</div>
