<script lang="ts">
	import type { SuperscriptNode as ParserSuperscriptNode } from 'stream-markdown-parser'
	import InlineNodeList from '../inline-node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserSuperscriptNode> = $props()
</script>

<sup class="markdown-svelte-superscript"><InlineNodeList nodes={node.children} {insideLink} /></sup>
