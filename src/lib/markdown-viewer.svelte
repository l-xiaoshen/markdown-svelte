<script lang="ts">
	import MarkdownRenderer from './markdown-renderer.svelte'
	import type { MarkdownViewerProps } from './markdown-viewer-props'
	import { parseMarkdown } from './parser'

	let { markdown, ...props }: MarkdownViewerProps = $props()

	let nodes = $derived(parseMarkdown(markdown))
</script>

<MarkdownRenderer {nodes} {...props} />
