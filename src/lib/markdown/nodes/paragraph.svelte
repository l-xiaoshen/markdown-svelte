<script lang="ts">
	import type { ParagraphNode as ParserParagraphNode } from 'stream-markdown-parser'
	import { safeHtml } from '../html-policy'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'
	import { paragraphSegments } from '../paragraph-segments'

	let { node }: NodeProps<ParserParagraphNode> = $props()
	let segments = $derived(paragraphSegments(node))
</script>

{#each segments as segment}
	{#if segment.kind === 'inline'}
		<p class="markdown-svelte-paragraph"><NodeList nodes={segment.nodes} /></p>
	{:else if segment.kind === 'block'}
		<NodeList nodes={[segment.node]} />
	{:else if segment.canRender}
		<div class="markdown-svelte-html-block">{@html safeHtml(segment.source)}</div>
	{:else}
		<p class="markdown-svelte-paragraph">{segment.source}</p>
	{/if}
{/each}

<style>
	:where(.markdown-svelte-paragraph) {
		margin: 0.85em 0;
		white-space: pre-line;
	}

	:where(.markdown-svelte-html-block) {
		display: contents;
	}
</style>
