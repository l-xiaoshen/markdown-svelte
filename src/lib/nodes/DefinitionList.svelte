<script lang="ts">
	import type { DefinitionListNode as ParserDefinitionListNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserDefinitionListNode> = $props()
</script>

<dl class="markdown-svelte-definition-list"><NodeList nodes={node.items} /></dl>

<style>
	:where(.markdown-svelte-definition-list) {
		margin: 1.25em 0;
	}
</style>
