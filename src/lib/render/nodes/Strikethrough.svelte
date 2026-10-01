<script lang="ts">
	import type { StrikethroughNode as ParserStrikethroughNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserStrikethroughNode> = $props()
</script>

<del class="markdown-svelte-strikethrough"><NodeList inline nodes={node.children} {insideLink} /></del>
