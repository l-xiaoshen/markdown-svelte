<script lang="ts">
	import type { ThematicBreakNode as ParserThematicBreakNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'

	let { node, stream = false }: NodeProps<ParserThematicBreakNode> & { stream?: boolean } = $props()
</script>

{#if node.type === 'thematic_break'}
	<hr class="markdown-svelte-thematic-break" class:markdown-svelte-stream-rule={stream} />
{/if}

<style>
	:where(.markdown-svelte-thematic-break) {
		margin: 2em 0;
		border: 0;
		border-top: 1px solid var(--_markdown-color-border);
	}
</style>
