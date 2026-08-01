<script lang="ts">
	import { slide } from 'svelte/transition'
	import type { MathBlockNode as ParserMathBlockNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../../node-props'
	import { streamSlide } from '../motion'
	import StreamingContent from './StreamingContent.svelte'

	let { node }: NodeProps<ParserMathBlockNode> = $props()
	let lines = $derived(node.content ? node.content.split('\n').length - Number(node.content.endsWith('\n')) : 0)
</script>

<pre
	class="markdown-svelte-math-block markdown-svelte-stream-math-block markdown-svelte-stream-math-size"
	style:height={`calc(2rem + ${lines}lh)`}
	in:slide|global={streamSlide}
	aria-label="Math block"><code><StreamingContent content={node.content} /></code></pre>

<style>
	:where(.markdown-svelte-math-block) {
		margin: 1.25em 0;
		overflow-x: auto;
		padding: 1rem;
		border: 1px solid var(--_markdown-color-border);
		border-radius: var(--_markdown-radius);
		background: var(--_markdown-color-surface);
		color: var(--_markdown-color-text);
		font-family: var(--_markdown-font-mono);
		font-size: 0.82rem;
		line-height: 1.65;
		text-align: center;
	}
</style>
