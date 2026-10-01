<script lang="ts">
	import { MarkdownViewer } from 'markdown-svelte'

	const source = '# Hello, **Svelte**!'
</script>

<MarkdownViewer
	markdown={source}
	baseUrl="https://docs.example.com/guide/"
	idPrefix="guide"
	class="documentation"
	aria-label="Rendered documentation"
/>
