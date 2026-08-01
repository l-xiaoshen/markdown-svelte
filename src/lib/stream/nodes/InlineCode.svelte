<script lang="ts">
	import type { InlineCodeNode as ParserInlineCodeNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../../node-props'
	import { useRenderContext } from '../../render-context'
	import { StreamingText } from '../streaming-text.svelte'
	import Delta from './Delta.svelte'

	let { node }: NodeProps<ParserInlineCodeNode> = $props()
	const context = useRenderContext()
	const stream = new StreamingText({
		getContent: () => node.code,
		getAnimate: () => context.animate === true
	})
</script>

<code class="markdown-svelte-inline-code markdown-svelte-stream-enter"
	>{stream.stableContent}{#if stream.deltaContent}<Delta
			content={stream.deltaContent}
			revision={stream.revision}
		/>{/if}</code
>

<style>
	:where(.markdown-svelte-inline-code) {
		padding: 0.15em 0.38em;
		border: 1px solid color-mix(in srgb, var(--_markdown-color-border), transparent 30%);
		border-radius: 0.3rem;
		background: var(--_markdown-color-code);
		font-family: var(--_markdown-font-mono);
		font-size: 0.88em;
	}
</style>
