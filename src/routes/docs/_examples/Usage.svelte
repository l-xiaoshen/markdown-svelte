<script lang="ts">
	import { MarkdownViewer } from 'markdown-svelte'

	let source = $state('# Hello, **Svelte**!')
</script>

<MarkdownViewer markdown={source} />
