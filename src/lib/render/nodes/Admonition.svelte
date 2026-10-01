<script lang="ts">
	import type { AdmonitionNode as ParserAdmonitionNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'
	import { useRenderContext } from '../context'

	let { node }: NodeProps<ParserAdmonitionNode> = $props()
	const context = useRenderContext()
</script>

<aside
	class="markdown-svelte-admonition"
	class:markdown-svelte-stream-block-enter={context.animate}
	data-kind={node.kind.toLowerCase()}
>
	<strong class="markdown-svelte-admonition-title">{node.title || node.kind}</strong>
	<NodeList nodes={node.children} />
</aside>

<style>
	:where(.markdown-svelte-admonition) {
		--admonition-color: var(--_markdown-color-accent);
		margin: 1.25em 0;
		padding: 0.9rem 1rem;
		border: 1px solid color-mix(in srgb, var(--admonition-color), transparent 62%);
		border-left: 0.28rem solid var(--admonition-color);
		border-radius: var(--_markdown-radius);
		background: color-mix(in srgb, var(--admonition-color), transparent 94%);
	}

	:where(.markdown-svelte-admonition[data-kind='warning']),
	:where(.markdown-svelte-admonition[data-kind='caution']) {
		--admonition-color: #9a5d00;
	}

	:where(.markdown-svelte-admonition[data-kind='danger']),
	:where(.markdown-svelte-admonition[data-kind='error']) {
		--admonition-color: #b52f2f;
	}

	:where(.markdown-svelte-admonition-title) {
		display: block;
		margin-bottom: 0.45rem;
		color: var(--admonition-color);
		font-size: 0.76rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	:where(.markdown-svelte-admonition) :global(.markdown-svelte-paragraph:first-of-type) {
		margin-top: 0;
	}

	:where(.markdown-svelte-admonition) :global(.markdown-svelte-paragraph:last-child) {
		margin-bottom: 0;
	}
</style>
