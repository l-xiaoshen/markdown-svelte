<script lang="ts">
	import type { FootnoteReferenceNode as ParserFootnoteReferenceNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'
	import { useRenderContext } from '../render-context'

	let { node, insideLink = false }: NodeProps<ParserFootnoteReferenceNode> = $props()
	const context = useRenderContext()
	let id = $derived(context.anchors.footnoteReferenceIds.get(node))
	let target = $derived(context.anchors.footnoteTargets.get(node))
	let href = $derived(target ? `#${target}` : undefined)
</script>

{#if insideLink}
	<sup class="markdown-svelte-footnote-reference">{node.id}</sup>
{:else}
	<sup class="markdown-svelte-footnote-reference" {id}
		><a class="markdown-svelte-footnote-reference-link" {href}>{node.id}</a></sup
	>
{/if}

<style>
	:where(.markdown-svelte-footnote-reference-link) {
		color: var(--_markdown-color-link);
		font-weight: 600;
		text-underline-offset: 0.16em;
	}
</style>
