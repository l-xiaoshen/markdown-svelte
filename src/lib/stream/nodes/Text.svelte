<script lang="ts">
	import type { TextNode as ParserTextNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../../node-props'
	import StreamingContent from './StreamingContent.svelte'

	let { node }: NodeProps<ParserTextNode> = $props()
</script>

<span class="markdown-svelte-text"><StreamingContent content={node.content} /></span>
