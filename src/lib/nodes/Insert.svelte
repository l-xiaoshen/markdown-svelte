<script lang="ts">
	import type { InsertNode as ParserInsertNode } from 'stream-markdown-parser'
	import InlineNodeList from '../inline-node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserInsertNode> = $props()
</script>

<ins class="markdown-svelte-insert"><InlineNodeList nodes={node.children} {insideLink} /></ins>
