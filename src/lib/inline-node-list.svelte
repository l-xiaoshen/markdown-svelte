<script lang="ts">
	import { isBlockContent } from './html-elements'
	import Node from './node.svelte'
	import { useRenderContext } from './render-context'
	import type { ParsedMarkdownNode } from './renderable-node'

	let { nodes, insideLink = false }: { nodes: readonly ParsedMarkdownNode[]; insideLink?: boolean } = $props()
	const context = useRenderContext()
	let Renderer = $derived(context.nodeRenderer ?? Node)
</script>

{#each nodes as node, index (index)}
	{#if isBlockContent(node)}
		{node.raw}
	{:else}
		<Renderer {node} {insideLink} />
	{/if}
{/each}
