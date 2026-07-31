<script lang="ts">
	import Node from './node.svelte'
	import type { ParsedMarkdownNode } from './renderable-node'

	let { nodes, insideLink = false }: { nodes: readonly ParsedMarkdownNode[]; insideLink?: boolean } = $props()
</script>

{#each nodes as node}
	<Node {node} {insideLink} />
{/each}
