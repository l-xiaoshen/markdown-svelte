<script lang="ts">
	import type { InlineNode as ParserInlineNode } from 'stream-markdown-parser'
	import InlineNodeList from '../inline-node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserInlineNode> = $props()
</script>

<span class="markdown-svelte-inline"><InlineNodeList nodes={node.children} {insideLink} /></span>
