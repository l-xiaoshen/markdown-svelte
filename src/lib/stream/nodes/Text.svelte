<script lang="ts">
	import type { TextNode as ParserTextNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../../markdown/node-props'
	import { useRenderContext } from '../../markdown/render-context'
	import { StreamingText } from '../streaming-text.svelte'
	import Delta from './Delta.svelte'

	let { node }: NodeProps<ParserTextNode> = $props()
	const context = useRenderContext()
	const stream = new StreamingText({
		getContent: () => node.content,
		getAnimate: () => context.animate === true
	})
</script>

<span class="markdown-svelte-text markdown-svelte-stream-enter"
	>{stream.stableContent}{#if stream.deltaContent}<Delta
			content={stream.deltaContent}
			revision={stream.revision}
		/>{/if}</span
>
