<script lang="ts">
	import type { EmojiNode as ParserEmojiNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserEmojiNode> = $props()
</script>

<span class="markdown-svelte-emoji">{node.markup}</span>
