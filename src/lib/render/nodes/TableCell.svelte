<script lang="ts">
	import type { TableCellNode as ParserTableCellNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserTableCellNode> = $props()
</script>

<svelte:element
	this={node.header ? 'th' : 'td'}
	class={[
		'markdown-svelte-table-cell',
		node.header ? 'markdown-svelte-table-cell--header' : 'markdown-svelte-table-cell--body'
	]}
	style:text-align={node.align ?? 'left'}
>
	<NodeList nodes={node.children} />
</svelte:element>

<style>
	:where(.markdown-svelte-table-cell) {
		padding: 0.65rem 0.8rem;
		vertical-align: top;
	}

	:where(.markdown-svelte-table-cell--header) {
		background: var(--_markdown-color-surface-strong);
		font-weight: 700;
	}
</style>
