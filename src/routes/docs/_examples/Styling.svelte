<script lang="ts">
	import { MarkdownViewer } from 'markdown-svelte'

	const source = '# Hello, **Svelte**!'
</script>

<MarkdownViewer markdown={source} class="documentation" />

<style>
	:global(.documentation) {
		--markdown-color-text: #172033;
		--markdown-color-link: #075985;
		--markdown-color-surface: #f5f7fa;
		--markdown-radius: 0.4rem;
	}

	:global(.documentation .markdown-svelte-heading--2) {
		border-bottom: 0;
	}
</style>
