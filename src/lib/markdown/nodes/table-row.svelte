<script lang="ts">
	import type { TableRowNode as ParserTableRowNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserTableRowNode> = $props()
</script>

<tr class="markdown-svelte-table-row"><NodeList nodes={node.cells} /></tr>

<style>
	:where(.markdown-svelte-table-row) {
		border-bottom: 1px solid var(--_markdown-color-border);
	}

	:where(.markdown-svelte-table-row:last-child) {
		border-bottom: 0;
	}
</style>
