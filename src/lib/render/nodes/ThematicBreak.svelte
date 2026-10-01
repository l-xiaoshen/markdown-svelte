<script lang="ts">
	import type { ThematicBreakNode as ParserThematicBreakNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'
	import { useRenderContext } from '../context'

	let {}: NodeProps<ParserThematicBreakNode> = $props()
	const context = useRenderContext()
</script>

<hr class="markdown-svelte-thematic-break" class:markdown-svelte-stream-rule={context.animate} />

<style>
	:where(.markdown-svelte-thematic-break) {
		margin: 2em 0;
		border: 0;
		border-top: 1px solid var(--_markdown-color-border);
	}
</style>
