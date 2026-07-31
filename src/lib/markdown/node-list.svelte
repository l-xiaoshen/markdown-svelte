<script lang="ts">
	import Node from './node.svelte'
	import { useRenderContext } from './render-context'
	import type { ParsedMarkdownNode } from './renderable-node'

	let { nodes, insideLink = false }: { nodes: readonly ParsedMarkdownNode[]; insideLink?: boolean } = $props()
	const context = useRenderContext()
	let Renderer = $derived(context.nodeRenderer ?? Node)
</script>

{#each nodes as node, index (index)}
	<Renderer {node} {insideLink} />
{/each}
