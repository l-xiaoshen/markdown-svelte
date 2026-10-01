<script lang="ts">
	import type { StrongNode as ParserStrongNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserStrongNode> = $props()
</script>

<strong class="markdown-svelte-strong"><NodeList inline nodes={node.children} {insideLink} /></strong>
