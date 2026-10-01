<script lang="ts">
	import type { NodeProps } from '../node-props'
	import type { ParsedMarkdownNode } from '../../renderable-node'

	let { node }: NodeProps<ParsedMarkdownNode> = $props()
</script>

{#if node.type !== 'label_open' && node.type !== 'label_close'}
	<span class="markdown-svelte-fallback">{node.raw}</span>
{/if}
