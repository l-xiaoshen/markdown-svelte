<script lang="ts">
	import type { HighlightNode as ParserHighlightNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserHighlightNode> = $props()
</script>

<mark class="markdown-svelte-highlight"><NodeList inline nodes={node.children} {insideLink} /></mark>

<style>
	:where(.markdown-svelte-highlight) {
		padding: 0.05em 0.18em;
		border-radius: 0.2em;
		background: #fde68a;
		color: #422006;
	}
</style>
