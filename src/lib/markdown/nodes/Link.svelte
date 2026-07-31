<script lang="ts">
	import type { LinkNode as ParserLinkNode } from 'stream-markdown-parser'
	import InlineNodeList from '../inline-node-list.svelte'
	import type { NodeProps } from '../node-props'
	import { useRenderContext } from '../render-context'
	import { safeLinkHref } from '../url-policy'

	let { node, insideLink = false }: NodeProps<ParserLinkNode> = $props()
	const context = useRenderContext()
	let href = $derived.by(() => {
		const safe = safeLinkHref(node.href, context.baseUrl)
		if (!safe?.startsWith('#')) {
			return safe
		}
		const target = context.anchors.fragments.get(safe.slice(1))
		return target ? `#${target}` : safe
	})
	let external = $derived(href !== null && /^https?:/i.test(href))
</script>

{#if insideLink}
	<InlineNodeList nodes={node.children} {insideLink} />
{:else if href}
	<a
		class="markdown-svelte-link"
		{href}
		title={node.title ?? undefined}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
	>
		<InlineNodeList nodes={node.children} insideLink />
	</a>
{:else}
	<InlineNodeList nodes={node.children} {insideLink} />
{/if}

<style>
	:where(.markdown-svelte-link) {
		color: var(--_markdown-color-link);
		font-weight: 600;
		text-decoration-color: color-mix(in srgb, var(--_markdown-color-link), transparent 55%);
		text-underline-offset: 0.16em;
	}

	:where(.markdown-svelte-link:hover) {
		text-decoration-thickness: 0.13em;
	}
</style>
