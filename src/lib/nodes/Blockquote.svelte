<script lang="ts">
	import type { BlockquoteNode as ParserBlockquoteNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, stream = false }: NodeProps<ParserBlockquoteNode> & { stream?: boolean } = $props()
</script>

<blockquote class="markdown-svelte-blockquote" class:markdown-svelte-stream-block-enter={stream}>
	<NodeList nodes={node.children} />
</blockquote>

<style>
	:where(.markdown-svelte-blockquote) {
		margin: 1.25em 0;
		padding: 0.2em 0 0.2em 1.2em;
		border-left: 0.22rem solid var(--_markdown-color-accent);
		color: var(--_markdown-color-muted);
	}

	:where(.markdown-svelte-blockquote) :global(.markdown-svelte-paragraph:first-child) {
		margin-top: 0;
	}

	:where(.markdown-svelte-blockquote) :global(.markdown-svelte-paragraph:last-child) {
		margin-bottom: 0;
	}
</style>
