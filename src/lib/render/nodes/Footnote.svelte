<script lang="ts">
	import type { FootnoteNode as ParserFootnoteNode } from 'stream-markdown-parser'
	import { useDocumentContext } from '../../document/context'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'
	import { useRenderContext } from '../context'

	let { node }: NodeProps<ParserFootnoteNode> = $props()
	const context = useRenderContext()
	const document = useDocumentContext()
	let id = $derived(document.anchors.footnoteIds.get(node))
</script>

<div class="markdown-svelte-footnote" class:markdown-svelte-stream-footnote={context.animate} {id}>
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
