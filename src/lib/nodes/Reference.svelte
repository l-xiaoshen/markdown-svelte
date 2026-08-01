<script lang="ts">
	import type { ReferenceNode as ParserReferenceNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserReferenceNode> = $props()
</script>

<span class="markdown-svelte-reference">{node.raw || node.id}</span>
