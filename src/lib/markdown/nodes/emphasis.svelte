<script lang="ts">
	import type { EmphasisNode as ParserEmphasisNode } from 'stream-markdown-parser'
	import InlineNodeList from '../inline-node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserEmphasisNode> = $props()
</script>

<em class="markdown-svelte-emphasis"><InlineNodeList nodes={node.children} {insideLink} /></em>
