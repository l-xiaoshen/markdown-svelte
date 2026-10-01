<script lang="ts">
	import type { EmphasisNode as ParserEmphasisNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserEmphasisNode> = $props()
</script>

<em class="markdown-svelte-emphasis"><NodeList inline nodes={node.children} {insideLink} /></em>
