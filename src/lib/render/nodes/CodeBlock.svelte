<script lang="ts">
	import { onDestroy } from 'svelte'
	import type { CodeBlockNode as ParserCodeBlockNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'
	import { useRenderContext } from '../context'

	let { node }: NodeProps<ParserCodeBlockNode> = $props()
	const context = useRenderContext()
	let copyState = $state<'idle' | 'copied' | 'failed'>('idle')
	let resetTimer: ReturnType<typeof setTimeout> | undefined
	let language = $derived(node.language.trim())
	let isDiff = $derived(node.diff === true || language.toLowerCase() === 'diff')
	let hasSplitDiff = $derived(node.originalCode !== undefined || node.updatedCode !== undefined)
	let languageLabel = $derived(
		isDiff ? (language && language !== 'diff' ? `diff / ${language}` : 'diff') : language || 'text'
	)
	let copyContent = $derived(isDiff ? node.raw || node.updatedCode || node.code : node.code)

	function streamHeight(content: string): string | undefined {
		if (!context.animate) return undefined
		const lines = content ? content.split('\n').length - Number(content.endsWith('\n')) : 0
		return `calc(2rem + ${lines}lh)`
	}

	async function copyCode(): Promise<void> {
		try {
			await navigator.clipboard.writeText(copyContent)
			copyState = 'copied'
		} catch {
			copyState = 'failed'
		}

		clearTimeout(resetTimer)
		resetTimer = setTimeout(() => {
			copyState = 'idle'
		}, 1600)
	}

	onDestroy(() => {
		clearTimeout(resetTimer)
	})
</script>

{#snippet code(content: string)}
	<pre
		class:markdown-svelte-stream-code-size={context.animate}
		class="markdown-svelte-code-pre"
		style:height={streamHeight(content)}><code>{content}</code></pre>
{/snippet}

<div class="markdown-svelte-code-block">
	<div class="markdown-svelte-code-header">
		{#key context.animate ? languageLabel : 'static'}
			<span class="markdown-svelte-code-language" class:markdown-svelte-stream-code-language={context.animate}
				>{languageLabel}</span
			>
		{/key}
		<button
			class="markdown-svelte-code-copy"
			type="button"
			data-state={copyState}
			onclick={copyCode}
			aria-label="Copy code"
		>
			{copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy'}
		</button>
	</div>
	{#if isDiff && hasSplitDiff}
		<div class="markdown-svelte-diff">
			<section class="markdown-svelte-diff-pane markdown-svelte-diff-pane--original">
				<strong class="markdown-svelte-diff-label">Original</strong>
				{@render code(node.originalCode ?? '')}
			</section>
			<section class="markdown-svelte-diff-pane markdown-svelte-diff-pane--updated">
				<strong class="markdown-svelte-diff-label">Updated</strong>
				{@render code(node.updatedCode ?? node.code)}
			</section>
		</div>
	{:else}
		{@render code(node.code)}
	{/if}
</div>

<style>
	:where(.markdown-svelte-code-block) {
		margin: 1.25em 0;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--_markdown-code-background), white 12%);
		border-radius: var(--_markdown-radius);
		background: var(--_markdown-code-background);
		color: var(--_markdown-code-text);
		box-shadow: 0 14px 30px rgb(15 23 42 / 0.12);
	}

	:where(.markdown-svelte-code-header) {
		display: flex;
		min-height: 2.5rem;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.45rem 0.75rem 0.45rem 1rem;
		border-bottom: 1px solid rgb(255 255 255 / 0.11);
		color: #aab5c5;
		font-family: var(--_markdown-font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	:where(.markdown-svelte-code-copy) {
		padding: 0.3rem 0.55rem;
		border: 1px solid rgb(255 255 255 / 0.13);
		border-radius: 0.35rem;
		background: transparent;
		color: inherit;
		font: inherit;
		letter-spacing: 0;
		text-transform: none;
		cursor: pointer;
	}

	:where(.markdown-svelte-code-copy:hover) {
		border-color: rgb(255 255 255 / 0.3);
		color: white;
	}

	:where(.markdown-svelte-code-copy[data-state='copied']) {
		color: #6ee7b7;
	}

	:where(.markdown-svelte-code-copy[data-state='failed']) {
		color: #fca5a5;
	}

	:where(.markdown-svelte-code-pre) {
		margin: 0;
		overflow-x: auto;
		padding: 1rem;
		font-family: var(--_markdown-font-mono);
		font-size: 0.82rem;
		line-height: 1.65;
		tab-size: 2;
	}

	:where(.markdown-svelte-diff) {
		display: grid;
		min-width: 0;
	}

	:where(.markdown-svelte-diff-pane + .markdown-svelte-diff-pane) {
		border-top: 1px solid rgb(255 255 255 / 0.11);
	}

	:where(.markdown-svelte-diff-label) {
		display: block;
		padding: 0.45rem 1rem;
		border-bottom: 1px solid rgb(255 255 255 / 0.08);
		color: #aab5c5;
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	@media (min-width: 46rem) {
		:where(.markdown-svelte-diff) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		:where(.markdown-svelte-diff-pane + .markdown-svelte-diff-pane) {
			border-top: 0;
			border-left: 1px solid rgb(255 255 255 / 0.11);
		}
	}

	@media print {
		:where(.markdown-svelte-code-copy) {
			display: none;
		}

		:where(.markdown-svelte-code-block) {
			box-shadow: none;
		}
	}
</style>
