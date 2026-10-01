<script lang="ts">
	import { createDocumentAnchors } from './anchors'
	import { provideDocumentContext } from './context'
	import type { MarkdownRendererProps } from '../markdown-props'
	import NodeList from '../render/node-list.svelte'

	let {
		nodes,
		allowRawHtml = false,
		baseUrl,
		idPrefix,
		class: className,
		...attributes
	}: MarkdownRendererProps = $props()

	let anchors = $derived(createDocumentAnchors(nodes, idPrefix, allowRawHtml))

	provideDocumentContext({
		get anchors() {
			return anchors
		},
		get allowRawHtml() {
			return allowRawHtml
		},
		get baseUrl() {
			return baseUrl?.toString()
		}
	})
</script>

<article {...attributes} class={['markdown-svelte', className]} data-markdown-svelte="">
	<NodeList {nodes} />
</article>

<style>
	:where(.markdown-svelte) {
		--_markdown-color-text: var(--markdown-color-text, #253044);
		--_markdown-color-muted: var(--markdown-color-muted, #667085);
		--_markdown-color-border: var(--markdown-color-border, #d7dde7);
		--_markdown-color-surface: var(--markdown-color-surface, #f5f7fa);
		--_markdown-color-surface-strong: var(--markdown-color-surface-strong, #e9edf3);
		--_markdown-color-link: var(--markdown-color-link, #0b62c4);
		--_markdown-color-accent: var(--markdown-color-accent, #087164);
		--_markdown-color-code: var(--markdown-color-code, #e8edf5);
		--_markdown-code-background: var(--markdown-code-background, #111827);
		--_markdown-code-text: var(--markdown-code-text, #e5edf8);
		--_markdown-radius: var(--markdown-radius, 0.55rem);
		--_markdown-font-sans: var(
			--markdown-font-sans,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif
		);
		--_markdown-font-mono: var(--markdown-font-mono, 'SFMono-Regular', Consolas, 'Liberation Mono', monospace);
		box-sizing: border-box;
		width: 100%;
		color: var(--_markdown-color-text);
		font-family: var(--_markdown-font-sans);
		font-size: 1rem;
		line-height: 1.72;
		overflow-wrap: anywhere;
	}

	:where(.markdown-svelte) :global(*) {
		box-sizing: border-box;
	}
</style>
