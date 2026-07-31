<script lang="ts">
	import type { HardBreakNode as ParserHardBreakNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserHardBreakNode> = $props()
</script>

{#if node.type === 'hardbreak'}
	<br class="markdown-svelte-hardbreak" />
{/if}
