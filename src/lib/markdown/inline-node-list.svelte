<script lang="ts">
	import { isBlockContent } from './html-elements'
	import Node from './node.svelte'
	import type { ParsedMarkdownNode } from './renderable-node'

	let { nodes, insideLink = false }: { nodes: readonly ParsedMarkdownNode[]; insideLink?: boolean } = $props()
</script>

{#each nodes as node}
	{#if isBlockContent(node)}
		{node.raw}
	{:else}
		<Node {node} {insideLink} />
	{/if}
{/each}
