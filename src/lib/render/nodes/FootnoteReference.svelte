<script lang="ts">
	import type { FootnoteReferenceNode as ParserFootnoteReferenceNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'
	import { useDocumentContext } from '../../document/context'

	let { node, insideLink = false }: NodeProps<ParserFootnoteReferenceNode> = $props()
	const context = useDocumentContext()
	let id = $derived(context.anchors.footnoteReferenceIds.get(node))
	let target = $derived(context.anchors.footnoteTargets.get(node))
	let href = $derived(target ? `#${target}` : undefined)
</script>

<sup class="markdown-svelte-footnote-reference" id={insideLink ? undefined : id}>
	{#if insideLink}
		{node.id}
	{:else}
		<a class="markdown-svelte-footnote-reference-link" {href}>{node.id}</a>
	{/if}
</sup>

<style>
	:where(.markdown-svelte-footnote-reference-link) {
		color: var(--_markdown-color-link);
		font-weight: 600;
		text-underline-offset: 0.16em;
	}
</style>
