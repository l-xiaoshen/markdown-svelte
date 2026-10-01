<script lang="ts">
	import type { HeadingNode as ParserHeadingNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'
	import { useDocumentContext } from '../../document/context'

	let { node, insideLink = false }: NodeProps<ParserHeadingNode> = $props()
	const context = useDocumentContext()
	let id = $derived(context.anchors.headingIds.get(node))
	let level = $derived([1, 2, 3, 4, 5].includes(node.level) ? node.level : 6)
</script>

<svelte:element this={`h${level}`} class={`markdown-svelte-heading markdown-svelte-heading--${level}`} {id}>
	<NodeList inline nodes={node.children} {insideLink} />
</svelte:element>

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
