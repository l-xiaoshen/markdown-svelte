<script lang="ts">
	import { MarkdownRenderer, parseMarkdown } from 'markdown-svelte'

	const nodes = parseMarkdown('# Hello, **Svelte**!')
</script>

<MarkdownRenderer {nodes} />
