<script lang="ts">
	import type { TableNode as ParserTableNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserTableNode> = $props()
</script>

<div class="markdown-svelte-table-wrapper">
	<table class="markdown-svelte-table">
		<thead class="markdown-svelte-table-head"><NodeList nodes={[node.header]} /></thead>
		<tbody class="markdown-svelte-table-body"><NodeList nodes={node.rows} /></tbody>
	</table>
</div>

<style>
	:where(.markdown-svelte-table-wrapper) {
		max-width: 100%;
		margin: 1.25em 0;
		overflow-x: auto;
		border: 1px solid var(--_markdown-color-border);
		border-radius: var(--_markdown-radius);
	}

	:where(.markdown-svelte-table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}
</style>
