<script lang="ts">
	import type { ListNode as ParserListNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserListNode> = $props()
</script>

<svelte:element
	this={node.ordered ? 'ol' : 'ul'}
	class={['markdown-svelte-list', node.ordered ? 'markdown-svelte-list--ordered' : 'markdown-svelte-list--unordered']}
	start={node.ordered ? (node.start ?? 1) : undefined}
>
	<NodeList nodes={node.items} />
</svelte:element>

<style>
	:where(.markdown-svelte-list) {
		margin: 0.9em 0;
		padding-left: 1.65em;
	}

	:global(:where(.markdown-svelte-list) :where(.markdown-svelte-list)) {
		margin: 0.3em 0;
	}
</style>
