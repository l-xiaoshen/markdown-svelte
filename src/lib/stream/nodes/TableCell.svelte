<script lang="ts">
	import type { TableCellNode as ParserTableCellNode } from 'stream-markdown-parser'
	import NodeList from '../../render/node-list.svelte'
	import type { NodeProps } from '../../render/node-props'

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
	<div class="markdown-svelte-stream-table-cell">
		<NodeList nodes={node.children} />
	</div>
</svelte:element>

<style>
	:where(.markdown-svelte-table-cell) {
		padding: 0;
		vertical-align: top;
	}

	:where(.markdown-svelte-stream-table-cell) {
		padding: 0.65rem 0.8rem;
	}

	:where(.markdown-svelte-table-cell--header) {
		background: var(--_markdown-color-surface-strong);
		font-weight: 700;
	}
</style>
