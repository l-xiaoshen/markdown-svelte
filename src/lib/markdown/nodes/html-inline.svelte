<script lang="ts">
	import type { HtmlInlineNode as ParserHtmlInlineNode } from 'stream-markdown-parser'
	import { canRenderHtmlTagAtRoot, isBlockHtmlTag } from '../html-elements'
	import { safeHtml } from '../html-policy'
	import InlineNodeList from '../inline-node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node, insideLink = false }: NodeProps<ParserHtmlInlineNode> = $props()
	let isAnchor = $derived(node.tag?.toLowerCase() === 'a' || /^<\s*a\b/i.test(node.content))
	let isBlock = $derived(isBlockHtmlTag(node.tag))
</script>

{#if insideLink && isAnchor}
	<InlineNodeList nodes={node.children} {insideLink} />
{:else if canRenderHtmlTagAtRoot(node.tag)}
	{#if isBlock}
		<div class="markdown-svelte-html-block">{@html safeHtml(node.content)}</div>
	{:else}
		<span class="markdown-svelte-html-inline">{@html safeHtml(node.content)}</span>
	{/if}
{:else}
	<span class="markdown-svelte-html-escaped">{node.raw}</span>
{/if}

<style>
	:where(.markdown-svelte-html-inline) {
		display: contents;
	}

	:where(.markdown-svelte-html-block) {
		display: contents;
	}
</style>
