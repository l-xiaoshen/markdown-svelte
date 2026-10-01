<script lang="ts">
	import type { ImageNode as ParserImageNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'
	import { useDocumentContext } from '../../document/context'
	import { safeImageSource } from '../../html/url-policy'

	let { node }: NodeProps<ParserImageNode> = $props()
	const context = useDocumentContext()
	let source = $derived(safeImageSource(node.src, context.baseUrl))
</script>

{#if source}
	<img class="markdown-svelte-image" src={source} alt={node.alt} title={node.title} loading="lazy" decoding="async" />
{:else}
	<span class="markdown-svelte-image-fallback">{node.alt}</span>
{/if}

<style>
	:where(.markdown-svelte-image) {
		display: block;
		max-width: 100%;
		height: auto;
		margin: 1.25em auto;
		border: 1px solid var(--_markdown-color-border);
		border-radius: var(--_markdown-radius);
	}

	:where(.markdown-svelte-image-fallback) {
		color: var(--_markdown-color-muted);
	}
</style>
