<script lang="ts">
	import type { MathBlockNode as ParserMathBlockNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserMathBlockNode> = $props()
</script>

<pre class="markdown-svelte-math-block" aria-label="Math block"><code>{node.content}</code></pre>

<style>
	:where(.markdown-svelte-math-block) {
		margin: 1.25em 0;
		overflow-x: auto;
		padding: 1rem;
		border: 1px solid var(--_markdown-color-border);
		border-radius: var(--_markdown-radius);
		background: var(--_markdown-color-surface);
		color: var(--_markdown-color-text);
		font-family: var(--_markdown-font-mono);
		font-size: 0.82rem;
		line-height: 1.65;
		text-align: center;
	}
</style>
