<script lang="ts">
	import type { HtmlInlineNode as ParserHtmlInlineNode } from 'stream-markdown-parser'
	import { canRenderHtmlTagAtRoot, isBlockHtmlTag } from '../../html/elements'
	import { safeHtml } from '../../html/policy'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'
	import { useDocumentContext } from '../../document/context'

	let { node, insideLink = false }: NodeProps<ParserHtmlInlineNode> = $props()
	const context = useDocumentContext()
	let isAnchor = $derived(node.tag?.toLowerCase() === 'a' || /^<\s*a\b/i.test(node.content))
	let isBlock = $derived(isBlockHtmlTag(node.tag))
</script>

{#if !context.allowRawHtml}
	<span class="markdown-svelte-html-escaped">{node.raw}</span>
{:else if insideLink && isAnchor}
	<NodeList inline nodes={node.children} {insideLink} />
{:else if canRenderHtmlTagAtRoot(node.tag)}
	<svelte:element
		this={isBlock ? 'div' : 'span'}
		class={isBlock ? 'markdown-svelte-html-block' : 'markdown-svelte-html-inline'}
		>{@html safeHtml(node.content)}</svelte:element
	>
{:else}
	<span class="markdown-svelte-html-escaped">{node.raw}</span>
{/if}

<style>
	:where(.markdown-svelte-html-inline, .markdown-svelte-html-block) {
		display: contents;
	}
</style>
