<script lang="ts">
	import { isBlockContent } from '../html/elements'
	import Node from './node.svelte'
	import type { ParsedMarkdownNode } from '../renderable-node'

	let {
		nodes,
		insideLink = false,
		inline = false
	}: { nodes: readonly ParsedMarkdownNode[]; insideLink?: boolean; inline?: boolean } = $props()
</script>

{#each nodes as node, index (index)}
	{#if inline && isBlockContent(node)}
		{node.raw}
	{:else}
		<Node {node} {insideLink} />
	{/if}
{/each}
