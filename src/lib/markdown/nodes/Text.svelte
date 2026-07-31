<script lang="ts">
	import type { TextNode as ParserTextNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserTextNode> = $props()
</script>

<span class="markdown-svelte-text">{node.content}</span>
