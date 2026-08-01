<script lang="ts">
	import type { ListNode as ParserListNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserListNode> = $props()
</script>

{#if node.ordered}
	<ol class="markdown-svelte-list markdown-svelte-list--ordered" start={node.start ?? 1}>
		<NodeList nodes={node.items} />
	</ol>
{:else}
	<ul class="markdown-svelte-list markdown-svelte-list--unordered">
		<NodeList nodes={node.items} />
	</ul>
{/if}

<style>
	:where(.markdown-svelte-list) {
		margin: 0.9em 0;
		padding-left: 1.65em;
	}

	:global(:where(.markdown-svelte-list) :where(.markdown-svelte-list)) {
		margin: 0.3em 0;
	}
</style>
