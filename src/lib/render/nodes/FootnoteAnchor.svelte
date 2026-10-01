<script lang="ts">
	import type { FootnoteAnchorNode as ParserFootnoteAnchorNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'
	import { useDocumentContext } from '../../document/context'

	let { node }: NodeProps<ParserFootnoteAnchorNode> = $props()
	const context = useDocumentContext()
	let targets = $derived(context.anchors.footnoteBacklinks.get(node) ?? [])
</script>

{#each targets as target, index}
	<a
		class="markdown-svelte-footnote-backlink"
		href={`#${target}`}
		aria-label={`Back to footnote reference ${node.id}${targets.length > 1 ? `, occurrence ${index + 1}` : ''}`}
		>&crarr;{#if targets.length > 1}<sup>{index + 1}</sup>{/if}</a
	>
{/each}

<style>
	:where(.markdown-svelte-footnote-backlink) {
		margin-left: 0.4em;
		color: var(--_markdown-color-link);
		font-weight: 600;
		text-underline-offset: 0.16em;
	}
</style>
