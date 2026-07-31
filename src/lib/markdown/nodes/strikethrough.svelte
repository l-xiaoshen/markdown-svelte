<script lang="ts">
	import type { StrikethroughNode as ParserStrikethroughNode } from 'stream-markdown-parser'
	import InlineNodeList from '../inline-node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserStrikethroughNode> = $props()
</script>

<del class="markdown-svelte-strikethrough"><InlineNodeList nodes={node.children} {insideLink} /></del>
