<script lang="ts">
	import type { VmrContainerNode as ParserVmrContainerNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'
	import { useRenderContext } from '../context'

	let { node }: NodeProps<ParserVmrContainerNode> = $props()
	const context = useRenderContext()
</script>

<aside class="markdown-svelte-container" class:markdown-svelte-stream-block-enter={context.animate}>
	<strong class="markdown-svelte-container-title">{node.name}</strong>
	<NodeList nodes={node.children} />
</aside>

<style>
	:where(.markdown-svelte-container) {
		margin: 1.25em 0;
		padding: 0.9rem 1rem;
		border: 1px solid var(--_markdown-color-border);
		border-left: 0.28rem solid var(--_markdown-color-accent);
		border-radius: var(--_markdown-radius);
		background: var(--_markdown-color-surface);
	}

	:where(.markdown-svelte-container-title) {
		display: block;
		margin-bottom: 0.45rem;
		color: var(--_markdown-color-accent);
		font-size: 0.76rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
