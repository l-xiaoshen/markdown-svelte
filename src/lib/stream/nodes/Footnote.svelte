<script lang="ts">
	import { slide } from 'svelte/transition'
	import type { FootnoteNode as ParserFootnoteNode } from 'stream-markdown-parser'
	import NodeList from '../../node-list.svelte'
	import type { NodeProps } from '../../node-props'
	import { useRenderContext } from '../../render-context'
	import { streamSlide } from '../motion'

	let { node }: NodeProps<ParserFootnoteNode> = $props()
	const context = useRenderContext()
	let id = $derived(context.anchors.footnoteIds.get(node))
</script>

<div class="markdown-svelte-footnote markdown-svelte-stream-footnote" {id} in:slide|global={streamSlide}>
	<sup class="markdown-svelte-footnote-label">{node.id}</sup>
	<div class="markdown-svelte-footnote-content"><NodeList nodes={node.children} /></div>
</div>

<style>
	:where(.markdown-svelte-footnote) {
		display: flex;
		gap: 0.65rem;
		margin: 0.55rem 0;
		color: var(--_markdown-color-muted);
		font-size: 0.84rem;
	}

	:where(.markdown-svelte-footnote-label) {
		min-width: 1rem;
		font-weight: 700;
	}

	:where(.markdown-svelte-footnote-content) :global(.markdown-svelte-paragraph) {
		margin: 0;
	}
</style>
