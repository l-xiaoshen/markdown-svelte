<script lang="ts">
	import type { InlineNode as ParserInlineNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserInlineNode> = $props()
</script>

<span class="markdown-svelte-inline"><NodeList inline nodes={node.children} {insideLink} /></span>
