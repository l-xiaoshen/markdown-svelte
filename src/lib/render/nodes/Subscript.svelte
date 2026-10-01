<script lang="ts">
	import type { SubscriptNode as ParserSubscriptNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserSubscriptNode> = $props()
</script>

<sub class="markdown-svelte-subscript"><NodeList inline nodes={node.children} {insideLink} /></sub>
