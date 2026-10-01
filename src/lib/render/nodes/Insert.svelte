<script lang="ts">
	import type { InsertNode as ParserInsertNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserInsertNode> = $props()
</script>

<ins class="markdown-svelte-insert"><NodeList inline nodes={node.children} {insideLink} /></ins>
