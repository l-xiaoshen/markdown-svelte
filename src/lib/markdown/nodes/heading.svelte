<script lang="ts">
	import type { HeadingNode as ParserHeadingNode } from 'stream-markdown-parser'
	import InlineNodeList from '../inline-node-list.svelte'
	import type { NodeProps } from '../node-props'
	import { useRenderContext } from '../render-context'

	let { node, insideLink = false }: NodeProps<ParserHeadingNode> = $props()
	const context = useRenderContext()
	let id = $derived(context.anchors.headingIds.get(node))
</script>

{#if node.level === 1}
	<h1 class="markdown-svelte-heading markdown-svelte-heading--1" {id}>
		<InlineNodeList nodes={node.children} {insideLink} />
	</h1>
{:else if node.level === 2}
	<h2 class="markdown-svelte-heading markdown-svelte-heading--2" {id}>
		<InlineNodeList nodes={node.children} {insideLink} />
	</h2>
{:else if node.level === 3}
	<h3 class="markdown-svelte-heading markdown-svelte-heading--3" {id}>
		<InlineNodeList nodes={node.children} {insideLink} />
	</h3>
{:else if node.level === 4}
	<h4 class="markdown-svelte-heading markdown-svelte-heading--4" {id}>
		<InlineNodeList nodes={node.children} {insideLink} />
	</h4>
{:else if node.level === 5}
	<h5 class="markdown-svelte-heading markdown-svelte-heading--5" {id}>
		<InlineNodeList nodes={node.children} {insideLink} />
	</h5>
{:else}
	<h6 class="markdown-svelte-heading markdown-svelte-heading--6" {id}>
		<InlineNodeList nodes={node.children} {insideLink} />
	</h6>
{/if}

<style>
	:where(.markdown-svelte-heading) {
		margin: 1.8em 0 0.65em;
		font-weight: 720;
		line-height: 1.22;
		letter-spacing: -0.025em;
		scroll-margin-top: 1.5rem;
	}

	:where(.markdown-svelte-heading--1) {
		margin-top: 0.2em;
		font-size: clamp(2rem, 5vw, 3rem);
	}

	:where(.markdown-svelte-heading--2) {
		padding-bottom: 0.35em;
		border-bottom: 1px solid var(--_markdown-color-border);
		font-size: clamp(1.45rem, 3vw, 2rem);
	}

	:where(.markdown-svelte-heading--3) {
		font-size: 1.35rem;
	}

	:where(.markdown-svelte-heading--4) {
		font-size: 1.1rem;
	}

	:where(.markdown-svelte-heading--5, .markdown-svelte-heading--6) {
		font-size: 0.98rem;
		letter-spacing: 0.045em;
		text-transform: uppercase;
	}
</style>
