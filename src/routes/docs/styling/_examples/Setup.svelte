<script lang="ts">
	import { MarkdownViewer } from 'markdown-svelte'

	const source = '# Hello, **Svelte**!'
</script>

<MarkdownViewer markdown={source} class="document" />

<!-- Or: <MarkdownStream {nodes} class="document" /> -->

<style>
	:global(.document) {
		--markdown-color-text: #292b29;
		--markdown-color-link: #a63f24;
		--markdown-color-surface: #f3f4ee;
		--markdown-radius: 0;
		--markdown-font-sans: system-ui, sans-serif;
		font-size: 1.05rem;
		line-height: 1.8;
	}

	:global(.document .markdown-svelte-heading--2) {
		border-bottom: 0;
		font-family: Georgia, serif;
	}
</style>
