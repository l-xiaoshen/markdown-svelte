<script lang="ts">
	import type { SubscriptNode as ParserSubscriptNode } from 'stream-markdown-parser'
	import InlineNodeList from '../inline-node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserSubscriptNode> = $props()
</script>

<sub class="markdown-svelte-subscript"><InlineNodeList nodes={node.children} {insideLink} /></sub>
