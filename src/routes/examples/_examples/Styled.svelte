<script lang="ts">
	import { MarkdownViewer } from 'markdown-svelte'
	import source from './styled.md?raw'
</script>

<MarkdownViewer markdown={source} class="custom-document" />

<style>
	:global(.custom-document) {
		--markdown-color-link: #7c3aed;
		--markdown-color-surface: #f5f3ff;
	}

	:global(.custom-document .markdown-svelte-heading--2) {
		border-bottom: 2px solid #7c3aed;
	}
</style>
