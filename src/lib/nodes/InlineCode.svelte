<script lang="ts">
	import type { InlineCodeNode as ParserInlineCodeNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserInlineCodeNode> = $props()
</script>

<code class="markdown-svelte-inline-code">{node.code}</code>

<style>
	:where(.markdown-svelte-inline-code) {
		padding: 0.15em 0.38em;
		border: 1px solid color-mix(in srgb, var(--_markdown-color-border), transparent 30%);
		border-radius: 0.3rem;
		background: var(--_markdown-color-code);
		font-family: var(--_markdown-font-mono);
		font-size: 0.88em;
	}
</style>
