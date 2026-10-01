<script lang="ts">
	import type { DefinitionItemNode as ParserDefinitionItemNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../../render/node-props'
	import DefinitionItem from '../../render/nodes/DefinitionItem.svelte'

	let { node }: NodeProps<ParserDefinitionItemNode> = $props()
</script>

<div class="markdown-svelte-stream-definition-item">
	<DefinitionItem {node} />
</div>

<style>
	:where(.markdown-svelte-stream-definition-item) {
		display: flow-root;
	}
</style>
