<script lang="ts">
	import type { HtmlBlockNode as ParserHtmlBlockNode } from 'stream-markdown-parser'
	import { canRenderHtmlTagAtRoot } from '../html-elements'
	import { safeHtml } from '../html-policy'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserHtmlBlockNode> = $props()
</script>

{#if canRenderHtmlTagAtRoot(node.tag)}
	<div class="markdown-svelte-html-block">{@html safeHtml(node.content)}</div>
{:else}
	<span class="markdown-svelte-html-escaped">{node.raw}</span>
{/if}

<style>
	:where(.markdown-svelte-html-block) {
		display: contents;
	}
</style>
