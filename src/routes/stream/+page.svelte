<script lang="ts">
	import MarkdownStream, { type ParsedMarkdownNode } from '$lib/stream'
	import { onMount } from 'svelte'
	import { getMarkdown, parseMarkdownToStructure } from 'stream-markdown-parser'

	const demoMarkdown = [
		'# Streaming parser example',
		'',
		'This document is rendered from a `ParsedNode[]` that changes after every chunk.',
		'',
		'## Current state',
		'',
		'- The parser instance is reused',
		'- The node array is replaced',
		'- Existing positions remain mounted',
		'',
		'```ts',
		'buffer += chunk',
		'nodes = parseMarkdownToStructure(buffer, parser)',
		'```',
		'',
		'Append-only text updates can fade in without remounting the whole document.'
	].join('\n')

	const usageExample = [
		'<' + 'script lang="ts">',
		"\timport MarkdownStream from 'markdown-svelte/stream'",
		"\timport { getMarkdown, parseMarkdownToStructure } from 'stream-markdown-parser'",
		'',
		"\tconst parser = getMarkdown('answer')",
		"\tlet buffer = ''",
		'\tlet nodes = $state([])',
		'',
		'\tfunction append(chunk: string, final = false) {',
		'\t\tbuffer += chunk',
		'\t\tnodes = parseMarkdownToStructure(buffer, parser, { final })',
		'\t}',
		'<' + '/script>',
		'',
		'<MarkdownStream {nodes} />'
	].join('\n')

	const chunkPattern = [2, 5, 3, 1, 4, 6, 2, 3]
	const parser = getMarkdown('markdown-svelte-stream-showcase')

	let source = $state('')
	let nodes = $state<ParsedMarkdownNode[]>([])
	let cursor = $state(0)
	let chunkCount = $state(0)
	let running = $state(false)
	let animate = $state(true)
	let delay = $state(40)
	let sourceViewport = $state<HTMLDivElement>()
	let outputViewport = $state<HTMLDivElement>()

	let complete = $derived(cursor >= demoMarkdown.length)
	let progress = $derived(Math.round((cursor / demoMarkdown.length) * 100))
	let status = $derived(complete ? 'Complete' : running ? 'Running' : cursor === 0 ? 'Ready' : 'Paused')

	function parseCurrentSource(final: boolean): void {
		nodes = parseMarkdownToStructure(source, parser, { final })
	}

	function pushChunk(): void {
		if (complete) {
			running = false
			return
		}

		const width = chunkPattern[chunkCount % chunkPattern.length]
		cursor = Math.min(cursor + width, demoMarkdown.length)
		chunkCount += 1
		source = demoMarkdown.slice(0, cursor)
		parseCurrentSource(cursor === demoMarkdown.length)

		if (cursor === demoMarkdown.length) {
			running = false
		}
	}

	function reset(autoplay = false): void {
		running = false
		cursor = 0
		chunkCount = 0
		source = ''
		nodes = []
		running = autoplay
	}

	function togglePlayback(): void {
		if (complete) {
			reset(true)
			return
		}
		running = !running
	}

	function finish(): void {
		cursor = demoMarkdown.length
		chunkCount += 1
		source = demoMarkdown
		parseCurrentSource(true)
		running = false
	}

	onMount(() => {
		running = true
	})

	$effect(() => {
		cursor
		if (!running || complete) {
			return
		}

		const timeout = window.setTimeout(pushChunk, delay)
		return () => window.clearTimeout(timeout)
	})

	$effect(() => {
		cursor
		const frame = requestAnimationFrame(() => {
			if (sourceViewport) {
				sourceViewport.scrollTop = sourceViewport.scrollHeight
			}
			if (outputViewport) {
				outputViewport.scrollTop = outputViewport.scrollHeight
			}
		})

		return () => cancelAnimationFrame(frame)
	})
</script>

<svelte:head>
	<title>Streaming renderer | markdown-svelte</title>
	<meta name="description" content="Interactive parsed-node streaming renderer example for markdown-svelte." />
</svelte:head>

<header class="page-header">
	<h1>Streaming renderer</h1>
	<p>Incremental parser output rendered from a node array that is replaced as each chunk arrives.</p>
</header>

<section class="example-section" aria-labelledby="live-example-title">
	<header>
		<h2 id="live-example-title">Live example</h2>
		<p>The left panel shows the source buffer. The right panel receives the latest parsed nodes.</p>
	</header>

	<div class="stream-demo">
		<div class="demo-controls">
			<div class="button-group">
				<button class="primary-button" type="button" onclick={togglePlayback}>
					{complete ? 'Replay' : running ? 'Pause' : 'Play'}
				</button>
				<button type="button" onclick={() => reset()} disabled={cursor === 0}>Reset</button>
				<button type="button" onclick={finish} disabled={complete}>Finish</button>
			</div>

			<div class="option-group">
				<label>
					Speed
					<select bind:value={delay}>
						<option value={72}>Slow</option>
						<option value={40}>Normal</option>
						<option value={16}>Fast</option>
					</select>
				</label>
				<label class="checkbox-label">
					<input type="checkbox" bind:checked={animate} />
					Animate text
				</label>
			</div>

			<span class="demo-status" aria-live="polite">{status} · {progress}%</span>
		</div>

		<div class="demo-grid">
			<section class="demo-panel" aria-labelledby="source-title">
				<header>
					<h3 id="source-title">Source</h3>
					<span>{cursor} / {demoMarkdown.length} characters</span>
				</header>
				<div class="panel-content source-content" bind:this={sourceViewport}>
					{#if source}
						<pre><code
								>{source}{#if !complete}<span class="source-caret" aria-hidden="true">|</span>{/if}</code
							></pre>
					{:else}
						<p class="empty-state">Waiting for the first chunk.</p>
					{/if}
				</div>
			</section>

			<section class="demo-panel" aria-labelledby="output-title">
				<header>
					<h3 id="output-title">Output</h3>
					<span>{nodes.length} top-level {nodes.length === 1 ? 'node' : 'nodes'}</span>
				</header>
				<div class="panel-content output-content" bind:this={outputViewport}>
					{#if nodes.length > 0}
						<MarkdownStream
							{nodes}
							{animate}
							idPrefix="stream-example"
							class="stream-example-output"
							aria-label="Streaming Markdown output"
							aria-busy={running ? 'true' : 'false'}
						/>
					{:else}
						<p class="empty-state">Parsed nodes will appear here.</p>
					{/if}
				</div>
			</section>
		</div>
	</div>
</section>

<section class="page-section usage-section">
	<h2>Usage</h2>
	<p>Keep the parser and source buffer outside the renderer, then replace <code>nodes</code> after each parse.</p>
	<pre class="code-block"><code>{usageExample}</code></pre>
</section>

<style>
	.example-section {
		padding: 2.75rem 0;
		border-top: 1px solid #e3e6ea;
	}

	.example-section > header {
		max-width: 48rem;
		margin-bottom: 1.25rem;
	}

	.example-section h2 {
		margin: 0;
		font-size: 1.5rem;
		letter-spacing: -0.02em;
	}

	.example-section header p {
		margin: 0.65rem 0 0;
		color: #4b5563;
		line-height: 1.65;
	}

	.stream-demo {
		border: 1px solid #d9dde3;
		border-radius: 0.4rem;
		overflow: hidden;
	}

	.demo-controls {
		display: flex;
		min-height: 3.5rem;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #d9dde3;
		background: #f7f8fa;
	}

	.button-group,
	.option-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.demo-controls button,
	.demo-controls select {
		min-height: 2rem;
		padding: 0.35rem 0.65rem;
		border: 1px solid #cbd1d9;
		border-radius: 0.3rem;
		background: #fff;
		color: #374151;
		font-size: 0.78rem;
	}

	.demo-controls button {
		cursor: pointer;
	}

	.demo-controls button:disabled {
		color: #9ca3af;
		cursor: not-allowed;
	}

	.demo-controls .primary-button {
		border-color: #1558d6;
		background: #1558d6;
		color: #fff;
	}

	.option-group {
		margin-left: auto;
	}

	.option-group label {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		color: #4b5563;
		font-size: 0.76rem;
	}

	.checkbox-label input {
		margin: 0;
		accent-color: #1558d6;
	}

	.demo-status {
		min-width: 5.5rem;
		color: #4b5563;
		font-size: 0.75rem;
		text-align: right;
	}

	.demo-grid {
		display: grid;
		height: 31rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.demo-panel {
		display: flex;
		min-width: 0;
		min-height: 0;
		flex-direction: column;
	}

	.demo-panel + .demo-panel {
		border-left: 1px solid #d9dde3;
	}

	.demo-panel > header {
		display: flex;
		min-height: 2.6rem;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0 1rem;
		border-bottom: 1px solid #d9dde3;
		background: #f7f8fa;
	}

	.demo-panel h3 {
		margin: 0;
		color: #4b5563;
		font-size: 0.75rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.demo-panel header span {
		color: #667085;
		font-size: 0.68rem;
	}

	.panel-content {
		min-height: 0;
		flex: 1;
		overflow: auto;
		padding: 1.25rem;
	}

	.source-content {
		background: #fbfcfd;
	}

	.source-content pre {
		margin: 0;
		font-size: 0.76rem;
		line-height: 1.7;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.source-caret {
		color: #1558d6;
		animation: caret-blink 850ms steps(1, end) infinite;
	}

	.empty-state {
		margin: 0;
		color: #6b7280;
		font-size: 0.82rem;
	}

	:global(.stream-example-output) {
		--markdown-stream-fade-duration: 210ms;
		font-size: 0.9rem;
	}

	:global(.stream-example-output .markdown-svelte-heading--1) {
		font-size: 1.75rem;
	}

	:global(.stream-example-output .markdown-svelte-heading--2) {
		font-size: 1.2rem;
	}

	:global(.stream-example-output .markdown-svelte-code-block) {
		box-shadow: none;
	}

	.usage-section {
		margin-top: 1rem;
	}

	@keyframes caret-blink {
		50% {
			opacity: 0;
		}
	}

	@media (max-width: 54rem) {
		.demo-controls {
			align-items: flex-start;
			flex-wrap: wrap;
		}

		.option-group {
			margin-left: 0;
		}

		.demo-status {
			margin-left: auto;
		}
	}

	@media (max-width: 48rem) {
		.demo-grid {
			height: auto;
			grid-template-columns: 1fr;
		}

		.demo-panel + .demo-panel {
			border-top: 1px solid #d9dde3;
			border-left: 0;
		}

		.panel-content {
			height: 22rem;
			flex: none;
		}
	}

	@media (max-width: 40rem) {
		.demo-controls,
		.option-group {
			align-items: stretch;
			flex-direction: column;
		}

		.button-group {
			display: grid;
			width: 100%;
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.option-group {
			width: 100%;
		}

		.option-group label {
			justify-content: space-between;
		}

		.demo-status {
			margin-left: 0;
			text-align: left;
		}

		.demo-panel > header {
			padding-inline: 0.75rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.source-caret {
			animation: none;
		}
	}
</style>
