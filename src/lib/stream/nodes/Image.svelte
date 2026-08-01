<script lang="ts">
	import type { ImageNode as ParserImageNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../../node-props'
	import { useRenderContext } from '../../render-context'
	import { safeImageSource } from '../../url-policy'

	let { node }: NodeProps<ParserImageNode> = $props()
	const context = useRenderContext()
	let source = $derived(safeImageSource(node.src, context.baseUrl))
	let loadedSource = $state<string>()
</script>

{#if source}
	{#key source}
		<img
			class="markdown-svelte-image markdown-svelte-stream-image"
			class:markdown-svelte-stream-image--loaded={loadedSource === source}
			src={source}
			alt={node.alt}
			title={node.title ?? undefined}
			loading="lazy"
			decoding="async"
			onload={() => (loadedSource = source)}
			onerror={() => (loadedSource = source)}
		/>
	{/key}
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
