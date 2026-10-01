<script lang="ts">
	import type { SuperscriptNode as ParserSuperscriptNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserSuperscriptNode> = $props()
</script>

<sup class="markdown-svelte-superscript"><NodeList inline nodes={node.children} {insideLink} /></sup>
