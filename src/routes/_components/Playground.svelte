<script lang="ts">
	import { onMount } from 'svelte'
	import MarkdownRenderer from '$lib/markdown-renderer.svelte'
	import MarkdownStream, { type ParsedMarkdownNode } from '$lib/stream'
	import { createFrameParser } from './frame-parser'
	import Icon from './Icon.svelte'
	import { playgroundExamples } from './playground-examples'
	import quickStartExample from './_examples/QuickStart.svelte?raw'

	const quickStartTokens = quickStartExample
		.trimEnd()
		.split(/(<\/?script>|'[^']*'|"[^"]*"|\b(?:import|from)\b|<[A-Z]\w*|\/>)/g)

	type Mode = 'stream' | 'instant'
	const chunkPattern = [2, 5, 3, 1, 4, 6, 2, 3]
	let example = $state<(typeof playgroundExamples)[number]>(playgroundExamples[0])
	let markdown = $state<string>(playgroundExamples[0].markdown)
	let mode = $state<Mode>('stream')
	let cursor = $state(0)
	let nodes = $state.raw<ParsedMarkdownNode[]>([])
	let requestedCursor = 0
	let chunkCount = 0
	let parser: ReturnType<typeof createFrameParser> | undefined
	let parseError = $state('')
	let streamKey = $state(0)
	let running = $state(false)
	let animate = $state(true)
	let reducedMotion = $state(false)
	let pageVisible = $state(true)
	let speed = $state(1)
	let followOutput = $state(true)
	let mobilePanel = $state<'source' | 'preview'>('preview')
	let outputViewport = $state<HTMLDivElement>()
	let outputContent = $state<HTMLDivElement>()
	let sourceViewport = $state<HTMLTextAreaElement>()
	let sourceScroll = $state(0)
	let copied = $state<'idle' | 'copied' | 'failed'>('idle')
	let copyTimer: ReturnType<typeof setTimeout> | undefined

	const complete = $derived(cursor >= markdown.length)
	const progress = $derived(markdown.length ? Math.round((cursor / markdown.length) * 100) : 0)
	const displayedProgress = $derived(mode === 'instant' && markdown ? 100 : progress)
	const modified = $derived(markdown !== example.markdown)
	const lineCount = $derived(markdown.split('\n').length)
	const status = $derived(
		parseError
			? 'Preview unavailable'
			: mode === 'instant'
				? 'Live preview'
				: !markdown
					? 'Ready'
					: complete
						? 'Complete'
						: running
							? 'Streaming'
							: 'Paused'
	)

	function startParser(): void {
		parser?.dispose()
		parser = undefined
		parseError = ''
		try {
			parser = createFrameParser({
				onUpdate: (response) => {
					// Nodes and progress commit together, at most once per animation frame.
					nodes = response.nodes
					cursor = response.cursor
					parseError = ''
					if (response.final) running = false
				},
				onError: (message) => {
					parseError = message
					running = false
				}
			})
			const source = mode === 'instant' ? markdown : markdown.slice(0, requestedCursor)
			parser.reset(source, mode === 'instant' || requestedCursor === markdown.length)
		} catch {
			parseError = 'The Markdown worker could not load. Please retry the preview.'
			running = false
		}
	}

	function pushChunk(): void {
		if (requestedCursor >= markdown.length) return
		requestedCursor = Math.min(requestedCursor + chunkPattern[chunkCount % chunkPattern.length], markdown.length)
		// Keep surrogate pairs together when someone pastes emoji into the editor.
		if (requestedCursor < markdown.length && /[\uD800-\uDBFF]/.test(markdown[requestedCursor - 1])) requestedCursor += 1
		chunkCount += 1
		parser?.update(markdown.slice(0, requestedCursor), requestedCursor === markdown.length)
	}

	function resetOutput(): void {
		parser?.reset()
		nodes = []
		cursor = 0
		requestedCursor = 0
		chunkCount = 0
		streamKey += 1
		outputViewport?.scrollTo({ top: 0, behavior: 'instant' })
		followOutput = true
	}

	function replay(): void {
		running = false
		mode = 'stream'
		mobilePanel = 'preview'
		resetOutput()
		pushChunk()
		running = Boolean(markdown) && !parseError
	}

	function togglePlayback(): void {
		if (complete || mode === 'instant') replay()
		else running = !running
	}

	function finish(): void {
		running = false
		requestedCursor = markdown.length
		parser?.update(markdown, true)
	}

	function changeMode(nextMode: Mode): void {
		if (mode === nextMode) return
		if (nextMode === 'stream') replay()
		else {
			running = false
			mode = 'instant'
			parser?.reset(markdown, true)
		}
	}

	function chooseExample(nextExample: (typeof playgroundExamples)[number]): void {
		running = false
		mobilePanel = 'preview'
		example = nextExample
		markdown = nextExample.markdown
		copied = 'idle'
		sourceScroll = 0
		sourceViewport?.scrollTo({ top: 0, left: 0 })
		if (mode === 'stream') {
			replay()
			if (reducedMotion) finish()
		} else {
			resetOutput()
			parser?.update(markdown, true)
		}
	}

	function editSource(event: Event): void {
		running = false
		mode = 'instant'
		markdown = (event.currentTarget as HTMLTextAreaElement).value
		copied = 'idle'
		parser?.reset(markdown, true)
	}

	function seek(event: Event): void {
		running = false
		requestedCursor = Number((event.currentTarget as HTMLInputElement).value)
		chunkCount = 0
		// Invalidate old responses, including results still waiting for the next frame.
		parser?.reset(markdown.slice(0, requestedCursor), requestedCursor === markdown.length)
	}

	function handleReadingWheel(event: WheelEvent): void {
		if (event.deltaY < 0) followOutput = false
	}

	function handleReadingKey(event: KeyboardEvent): void {
		if (['ArrowUp', 'PageUp', 'Home'].includes(event.key)) followOutput = false
	}

	function handleReadingPointer(event: PointerEvent): void {
		if (event.pointerType === 'touch' || event.target === event.currentTarget) followOutput = false
	}

	async function copySource(): Promise<void> {
		try {
			await navigator.clipboard.writeText(markdown)
			copied = 'copied'
		} catch {
			copied = 'failed'
		}
		clearTimeout(copyTimer)
		copyTimer = setTimeout(() => (copied = 'idle'), 2000)
	}

	onMount(() => {
		startParser()
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
		function updateMotion(): void {
			reducedMotion = preference.matches
			animate = !preference.matches
			if (preference.matches) finish()
		}
		function updateVisibility(): void {
			pageVisible = !document.hidden
		}
		updateMotion()
		updateVisibility()
		if (!reducedMotion && !parseError) running = true
		preference.addEventListener('change', updateMotion)
		document.addEventListener('visibilitychange', updateVisibility)
		return () => {
			parser?.dispose()
			clearTimeout(copyTimer)
			preference.removeEventListener('change', updateMotion)
			document.removeEventListener('visibilitychange', updateVisibility)
		}
	})

	$effect(() => {
		streamKey
		if (!running || mode !== 'stream' || !pageVisible) return
		const interval = setInterval(pushChunk, 42 / speed)
		return () => clearInterval(interval)
	})

	$effect(() => {
		if (!outputViewport || !outputContent || !followOutput || mode !== 'stream') return
		const viewport = outputViewport
		const instant = reducedMotion
		let frame = 0
		let previousTime = 0
		// Cancel any pending native keyboard scroll when the reader re-enables following.
		viewport.scrollTo({ top: viewport.scrollTop, behavior: 'instant' })

		function step(time: number): void {
			const bottom = viewport.scrollHeight - viewport.clientHeight
			const distance = bottom - viewport.scrollTop
			if (instant || distance <= 1) {
				viewport.scrollTo({ top: bottom, behavior: 'instant' })
				frame = 0
				return
			}
			const amount = Math.max(1, distance * (1 - Math.exp(-(time - previousTime) / 90)))
			previousTime = time
			viewport.scrollTo({ top: viewport.scrollTop + amount, behavior: 'instant' })
			frame = requestAnimationFrame(step)
		}

		function follow(): void {
			if (frame) return
			previousTime = performance.now()
			frame = requestAnimationFrame(step)
		}

		// Also follow height changes during code-block transitions and after the last chunk.
		const observer = new ResizeObserver(follow)
		observer.observe(outputContent)
		follow()
		return () => {
			observer.disconnect()
			cancelAnimationFrame(frame)
		}
	})
</script>

<div class="playground">
	<header class="playground-intro">
		<div>
			<h1>Playground</h1>
			<p class="intro-description">Edit Markdown and replay it as a stream.</p>
		</div>
	</header>

	<section aria-label="Markdown playground">
		<div class="workbench-toolbar">
			<div class="example-picker" role="group" aria-label="Markdown examples">
				{#each playgroundExamples as item}
					<button
						class:active={example.id === item.id && !modified}
						aria-pressed={example.id === item.id && !modified}
						onclick={() => chooseExample(item)}>{item.label}</button
					>
				{/each}
			</div>
			<div class="mode-picker" role="group" aria-label="Rendering mode">
				<button class:active={mode === 'stream'} aria-pressed={mode === 'stream'} onclick={() => changeMode('stream')}
					><Icon name="wave" size={14} /> Streaming</button
				>
				<button
					class:active={mode === 'instant'}
					aria-pressed={mode === 'instant'}
					onclick={() => changeMode('instant')}><Icon name="eye" size={14} /> Instant preview</button
				>
			</div>
		</div>

		<div class="mobile-panel-picker" role="group" aria-label="Visible panel">
			<button
				class:active={mobilePanel === 'preview'}
				aria-pressed={mobilePanel === 'preview'}
				onclick={() => (mobilePanel = 'preview')}><Icon name="eye" /> Preview</button
			>
			<button
				class:active={mobilePanel === 'source'}
				aria-pressed={mobilePanel === 'source'}
				onclick={() => (mobilePanel = 'source')}><Icon name="code" /> Edit source</button
			>
		</div>

		<div class="editor-grid" data-mobile-panel={mobilePanel}>
			<section class="source-panel" aria-labelledby="source-title">
				<header class="panel-header">
					<div class="panel-title">
						<Icon name="code" />
						<h2 id="source-title">Markdown</h2>
						<span class="file-name">{modified ? 'your-markdown.md' : example.filename}</span>
					</div>
					<div class="source-actions">
						{#if modified}<button class="text-button" onclick={() => chooseExample(example)}>Restore example</button
							>{/if}
						<button
							class="icon-button"
							onclick={copySource}
							aria-label={copied === 'copied'
								? 'Source copied'
								: copied === 'failed'
									? 'Copy failed. Select and copy the source manually.'
									: 'Copy Markdown'}
							title={copied === 'copied'
								? 'Copied'
								: copied === 'failed'
									? 'Copy failed — select and copy the source'
									: 'Copy Markdown'}><Icon name={copied === 'copied' ? 'check' : 'copy'} /></button
						>
					</div>
				</header>
				<div class="source-editor">
					<div class="line-gutter" aria-hidden="true">
						<div style:transform={`translateY(-${sourceScroll}px)`}>
							{#each Array(lineCount) as _, index}<span>{index + 1}</span>{/each}
						</div>
					</div>
					<textarea
						bind:this={sourceViewport}
						aria-label="Markdown source"
						value={markdown}
						oninput={editSource}
						onscroll={() => (sourceScroll = sourceViewport?.scrollTop ?? 0)}
						spellcheck="false"
						autocapitalize="off"
						autocomplete="off"
						wrap="off"
						placeholder="# Heading"></textarea>
				</div>
			</section>

			<section class="preview-panel" aria-labelledby="preview-title">
				<header class="panel-header">
					<div class="panel-title">
						<Icon name="eye" />
						<h2 id="preview-title">Preview</h2>
					</div>
					{#if mode === 'stream'}<label class="follow-control"
							><input type="checkbox" bind:checked={followOutput} /> Follow stream</label
						>{/if}
				</header>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions (The scrolling preview supports keyboard navigation.) -->
				<div
					class="rendered-content"
					class:motion-disabled={!animate}
					bind:this={outputViewport}
					onwheel={handleReadingWheel}
					onkeydown={handleReadingKey}
					onpointerdown={handleReadingPointer}
					tabindex="0"
					role="region"
					aria-label="Rendered Markdown"
				>
					{#if parseError}
						<div class="empty-preview" role="alert">
							<p>{parseError}</p>
							<button class="text-button" onclick={startParser}>Retry preview</button>
						</div>
					{:else if !markdown}
						<div class="empty-preview">
							<Icon name="code" size={28} />
							<h3>No Markdown</h3>
							<p>Enter Markdown or select an example.</p>
						</div>
					{:else}
						<div bind:this={outputContent}>
							{#if mode === 'instant'}
								<MarkdownRenderer
									{nodes}
									idPrefix="playground"
									class="playground-output"
									aria-label="Markdown preview"
								/>
							{:else}
								{#key streamKey}<MarkdownStream
										{nodes}
										{animate}
										idPrefix="playground"
										class="playground-output"
										aria-label="Streaming Markdown preview"
										aria-busy={running}
									/>{/key}
							{/if}
						</div>
					{/if}
				</div>
				<footer class="panel-footer">
					<span role="status" class:streaming={running && mode === 'stream'}>{status}</span><span
						>{mode === 'stream' ? `${cursor} / ${markdown.length}` : markdown.length} characters</span
					>
				</footer>
			</section>
		</div>

		<div class="playback-bar">
			<div class="playback-actions">
				<button class="primary-button" onclick={togglePlayback} disabled={!markdown}
					><Icon name={mode === 'instant' || complete ? 'replay' : running ? 'pause' : 'play'} />{mode === 'instant'
						? 'Stream this'
						: complete
							? 'Replay'
							: running
								? 'Pause'
								: 'Resume'}</button
				>
				<button
					class="icon-button"
					onclick={replay}
					disabled={!markdown}
					aria-label="Replay from the beginning"
					title="Replay from the beginning"><Icon name="replay" /></button
				>
				<button
					class="icon-button"
					onclick={finish}
					disabled={complete || mode === 'instant' || !markdown}
					aria-label="Show complete Markdown"
					title="Show complete Markdown"><Icon name="skip" /></button
				>
			</div>
			<label class="progress-control"
				><span class="sr-only">Stream progress</span><input
					type="range"
					min="0"
					max={markdown.length || 1}
					value={mode === 'instant' ? markdown.length : cursor}
					aria-label="Stream progress"
					aria-valuetext={`${displayedProgress}% rendered`}
					style:--progress={`${displayedProgress}%`}
					disabled={mode === 'instant' || !markdown}
					oninput={seek}
				/><span class="progress-value" aria-hidden="true">{displayedProgress}%</span></label
			>
			<div class="playback-options">
				<label class="speed-control"
					>Speed<select bind:value={speed} aria-label="Streaming speed"
						><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select
					></label
				>
				<label
					class="motion-control"
					title={reducedMotion
						? 'Reduced motion is enabled in your system settings'
						: 'Fade new content in as it arrives'}
					><input type="checkbox" role="switch" bind:checked={animate} disabled={reducedMotion} /><span
						class="switch-track"
						aria-hidden="true"
					></span>Fade in</label
				>
			</div>
		</div>
	</section>

	<div class="playground-note">
		<span
			>{mode === 'instant'
				? 'Select Stream this to replay your changes.'
				: reducedMotion
					? 'Reduced motion is enabled. Select Replay to start streaming.'
					: 'Scroll up to stop following the stream.'}</span
		><a href="/docs/#streaming">Streaming API <Icon name="arrow" size={14} /></a>
	</div>

	<section class="quick-start" aria-label="Usage">
		<div>
			<h2>Usage</h2>
			<p>Install the package, then import a renderer.</p>
			<a href="/docs/">API reference <Icon name="arrow" /></a>
		</div>
		<div class="quick-start-code">
			<div class="code-caption"><span>Example.svelte</span><code>npm i markdown-svelte</code></div>
			<pre><code
					>{#each quickStartTokens as token}<span
							class:code-muted={/^<\/?script>$/.test(token)}
							class:code-keyword={/^(?:import|from|<[A-Z]\w*|\/>)$/.test(token)}
							class:code-string={/^['"]/.test(token)}>{token}</span
						>{/each}</code
				></pre>
		</div>
	</section>
</div>

<style>
	.playground {
		--accent: #c74824;
		--ink: #292b29;
		--muted: #71736e;
		--border: #e3e4dc;
	}
	.playground-intro {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}
	h1 {
		margin: 0;
		color: var(--ink);
		font-size: clamp(1.75rem, 3vw, 2.2rem);
		font-weight: 600;
		letter-spacing: -0.04em;
		line-height: 1.1;
	}
	.intro-description {
		margin: 0.85rem 0 0;
		color: var(--muted);
		font-size: 0.91rem;
		line-height: 1.5;
	}
	.playground-note a,
	.quick-start a {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		color: var(--ink);
		text-decoration: none;
		font-size: 0.75rem;
		font-weight: 550;
	}
	.playground-note a:hover,
	.quick-start a:hover {
		color: var(--accent);
	}
	.workbench-toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem 0 0.85rem;
		border-bottom: 1px solid var(--border);
	}
	.example-picker,
	.mode-picker,
	.playback-actions,
	.playback-options {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		border: 0;
		cursor: pointer;
		transition:
			background 140ms,
			color 140ms;
	}
	button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	button:focus-visible,
	a:focus-visible,
	select:focus-visible,
	input:focus-visible,
	.rendered-content:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}
	.example-picker button {
		min-height: 2rem;
		padding: 0.45rem 0 0.55rem;
		border-bottom: 2px solid transparent;
		background: transparent;
		color: #6c6f68;
		font-size: 0.72rem;
		white-space: nowrap;
	}
	.example-picker button:hover {
		color: var(--ink);
	}
	.example-picker button.active {
		border-bottom-color: var(--accent);
		color: #ae3f21;
	}
	.example-picker {
		gap: 1.1rem;
	}
	.mode-picker {
		gap: 1.1rem;
		padding-left: 1.25rem;
		border-left: 1px solid var(--border);
	}
	.mode-picker button {
		min-height: 2rem;
		padding: 0.45rem 0 0.55rem;
		border-bottom: 2px solid transparent;
		background: transparent;
		color: var(--muted);
		font-size: 0.7rem;
		white-space: nowrap;
	}
	.mode-picker button.active {
		border-bottom-color: var(--accent);
		color: var(--accent);
	}
	.mobile-panel-picker {
		display: none;
	}
	.editor-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		height: clamp(18rem, calc(100svh - 26rem), 36rem);
	}
	.source-panel,
	.preview-panel {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
	}
	.source-panel {
		border-right: 1px solid var(--border);
	}
	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 3rem;
		gap: 0.5rem;
		padding: 0 1.1rem;
	}
	.panel-title {
		display: flex;
		align-items: center;
		min-width: 0;
		gap: 0.55rem;
		color: #8a8e84;
	}
	.panel-title h2 {
		margin: 0;
		color: #40443b;
		font-size: 0.74rem;
		font-weight: 600;
	}
	.file-name {
		margin-left: 0.15rem;
		overflow: hidden;
		color: var(--muted);
		font-family: ui-monospace, monospace;
		font-size: 0.64rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.source-actions {
		display: flex;
		align-items: center;
	}
	.icon-button {
		flex-shrink: 0;
		width: 1.9rem;
		height: 1.9rem;
		padding: 0;
		border-radius: 0.15rem;
		background: transparent;
		color: #7c8075;
	}
	.icon-button:hover:not(:disabled) {
		background: #edeee7;
		color: var(--ink);
	}
	.text-button {
		background: transparent;
		color: var(--accent);
		font-size: 0.65rem;
		white-space: nowrap;
	}
	.follow-control {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--muted);
		font-size: 0.64rem;
		cursor: pointer;
		white-space: nowrap;
	}
	.follow-control input {
		width: 0.75rem;
		height: 0.75rem;
		margin: 0;
		accent-color: #6f8360;
	}
	.source-editor {
		display: flex;
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}
	.line-gutter {
		flex: 0 0 2.9rem;
		overflow: hidden;
		color: #b0b4a8;
		text-align: right;
		user-select: none;
	}
	.line-gutter > div {
		padding-top: 1.4rem;
	}
	.line-gutter span {
		display: block;
		padding-right: 0.9rem;
		font:
			0.76rem/1.9 ui-monospace,
			SFMono-Regular,
			Menlo,
			Monaco,
			Consolas,
			monospace;
	}
	textarea {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		resize: none;
		padding: 1.4rem 1.25rem 2rem 0.4rem;
		border: 0;
		outline: 0;
		background: transparent;
		color: #606950;
		font:
			0.76rem/1.9 ui-monospace,
			SFMono-Regular,
			Menlo,
			Monaco,
			Consolas,
			monospace;
		tab-size: 2;
		caret-color: var(--accent);
	}
	textarea:focus-visible {
		box-shadow: inset 0 0 0 2px #c7482440;
	}
	textarea::placeholder {
		color: var(--muted);
	}
	.rendered-content {
		flex: 1;
		min-height: 0;
		padding: 1.55rem 1.9rem 2rem;
		overflow: auto;
		overflow-anchor: none;
		scrollbar-gutter: stable;
	}
	textarea,
	.rendered-content {
		scrollbar-width: thin;
		scrollbar-color: #d7dacd transparent;
	}
	.panel-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.3rem;
		padding: 0 1.1rem;
		color: var(--muted);
		font-size: 0.61rem;
		font-variant-numeric: tabular-nums;
	}
	.streaming {
		color: #66864f;
	}
	.playback-bar {
		display: flex;
		align-items: center;
		gap: 1rem;
		min-height: 4.1rem;
		padding: 0.3rem 0;
		border-top: 1px solid var(--border);
	}
	.playback-actions {
		gap: 0.3rem;
	}
	.primary-button {
		min-width: 6rem;
		min-height: 2.2rem;
		padding: 0.45rem 0.85rem;
		border-radius: 0.15rem;
		background: var(--accent);
		color: #fff;
		font-size: 0.73rem;
		font-weight: 550;
	}
	.primary-button:hover:not(:disabled) {
		background: #ab3b1c;
	}
	.progress-control {
		display: flex;
		flex: 1;
		align-items: center;
		gap: 0.65rem;
		min-width: 5rem;
	}
	.progress-control input {
		width: 100%;
		min-width: 2rem;
		height: 0.23rem;
		margin: 0;
		appearance: none;
		border: none;
		border-radius: 1rem;
		background: linear-gradient(to right, var(--accent) var(--progress), #e8eae1 var(--progress));
		cursor: pointer;
	}
	.progress-control input::-webkit-slider-thumb {
		width: 0.65rem;
		height: 0.65rem;
		appearance: none;
		border: 2px solid white;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 1px #c7482433;
	}
	.progress-control input::-moz-range-thumb {
		width: 0.4rem;
		height: 0.4rem;
		border: 2px solid white;
		border-radius: 50%;
		background: var(--accent);
	}
	.progress-control input:disabled {
		opacity: 0.45;
		cursor: default;
	}
	.progress-value {
		min-width: 2.2rem;
		color: var(--muted);
		font-family: ui-monospace, monospace;
		font-size: 0.64rem;
		text-align: right;
	}
	.playback-options {
		gap: 1rem;
		padding-left: 1rem;
		border-left: 1px solid var(--border);
	}
	.speed-control {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		color: #6c7065;
		font-size: 0.68rem;
	}
	select {
		min-height: 1.8rem;
		padding: 0.2rem;
		border: 0;
		background: transparent;
		color: var(--ink);
		font-size: 0.68rem;
		cursor: pointer;
	}
	.motion-control {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.45rem;
		color: #6c7065;
		font-size: 0.68rem;
		white-space: nowrap;
		cursor: pointer;
	}
	.motion-control input {
		position: absolute;
		width: 2rem;
		height: 1.2rem;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}
	.switch-track {
		box-sizing: border-box;
		width: 1.8rem;
		height: 1rem;
		padding: 0.15rem;
		border-radius: 1rem;
		background: #d9dcd1;
		pointer-events: none;
		transition: background 160ms;
	}
	.switch-track::after {
		display: block;
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		background: white;
		box-shadow: 0 1px 2px #0002;
		content: '';
		transition: transform 160ms;
	}
	.motion-control input:checked + .switch-track {
		background: #768d60;
	}
	.motion-control input:checked + .switch-track::after {
		transform: translateX(0.8rem);
	}
	.motion-control input:focus-visible + .switch-track {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}
	.motion-control input:disabled + .switch-track {
		opacity: 0.5;
	}
	.playground-note {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 0.95rem;
		padding: 0 0.1rem;
		color: var(--muted);
		font-size: 0.66rem;
		line-height: 1.5;
	}
	.playground-note a {
		flex-shrink: 0;
		color: #74786b;
		font-size: 0.66rem;
		font-weight: 400;
	}
	.quick-start {
		display: grid;
		grid-template-columns: 1fr 1.45fr;
		gap: 3rem;
		align-items: center;
		padding-top: 2.8rem;
		margin-top: 3rem;
		border-top: 1px solid var(--border);
	}
	.quick-start h2 {
		max-width: 17rem;
		margin: 0;
		color: #41463a;
		font-size: 1.2rem;
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1.25;
	}
	.quick-start p {
		margin: 0.75rem 0 1rem;
		color: var(--muted);
		font-size: 0.72rem;
	}
	.quick-start a {
		color: var(--accent);
		font-size: 0.7rem;
	}
	.quick-start-code {
		min-width: 0;
	}
	.code-caption {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem 0 0.8rem;
		border-bottom: 1px solid #e3e6da;
		color: var(--muted);
		font-family: ui-monospace, monospace;
		font-size: 0.63rem;
	}
	.code-caption code {
		color: #777e69;
		font-size: 0.63rem;
		letter-spacing: 0;
	}
	.quick-start pre {
		margin: 0;
		padding: 1.2rem 0 0;
		overflow: auto;
		color: #626954;
		font-size: 0.73rem;
		line-height: 1.85;
	}
	.code-muted {
		color: #919887;
	}
	.code-keyword {
		color: #9f573e;
	}
	.code-string {
		color: #697d4e;
	}
	.empty-preview {
		display: grid;
		justify-items: center;
		align-content: center;
		height: 100%;
		color: #a0a593;
		text-align: center;
	}
	.empty-preview h3 {
		margin: 1rem 0 0.3rem;
		color: #606952;
		font-size: 1rem;
		font-weight: 500;
	}
	.empty-preview p {
		max-width: 15rem;
		font-size: 0.8rem;
		line-height: 1.6;
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	:global(.playground-output) {
		--markdown-color-text: #444c3b;
		--markdown-color-muted: #828b75;
		--markdown-color-border: #e0e5d6;
		--markdown-color-surface: #f5f7ef;
		--markdown-color-link: #b84c2a;
		--markdown-color-accent: #7b915f;
		--markdown-code-background: #f5f6f0;
		--markdown-code-text: #566348;
		--markdown-stream-fade-duration: 280ms;
		--markdown-radius: 0;
		font-size: 0.86rem;
		line-height: 1.8;
	}
	:global(.playground-output .markdown-svelte-heading--1) {
		margin-top: 0;
		font-size: 1.8rem;
		font-weight: 600;
		letter-spacing: -0.04em;
	}
	:global(.playground-output .markdown-svelte-heading--2) {
		margin-top: 1.4em;
		border: 0;
		padding: 0;
		font-size: 1.12rem;
		font-weight: 600;
	}
	:global(.playground-output .markdown-svelte-heading--3) {
		font-size: 0.95rem;
	}
	:global(.playground-output .markdown-svelte-code-block) {
		border: 0;
		border-left: 2px solid #e0e5d6;
		box-shadow: none;
	}
	:global(.playground-output .markdown-svelte-table-wrapper) {
		border: 0;
	}
	:global(.playground-output .markdown-svelte-code-header) {
		min-height: 2rem;
		border-color: #e0e5d6;
		color: #8a967b;
	}
	:global(.playground-output .markdown-svelte-code-copy) {
		border: 0;
		border-radius: 0;
		background: transparent;
	}
	:global(.playground-output .markdown-svelte-code-copy:hover) {
		color: #455437;
	}
	:global(.playground-output .markdown-svelte-code-pre) {
		font-size: 0.73rem;
	}
	:global(.playground-output .markdown-svelte-table) {
		font-size: 0.76rem;
	}
	.motion-disabled :global(*) {
		animation: none !important;
		transition: none !important;
	}
	@media (min-width: 90rem) {
		.editor-grid {
			height: min(55vh, 39rem);
		}
	}
	@media (max-width: 64rem) {
		.workbench-toolbar {
			flex-wrap: wrap;
		}
		.playback-bar {
			gap: 0.6rem;
		}
		.playback-options {
			gap: 0.65rem;
			padding-left: 0.65rem;
		}
		.file-name {
			display: none;
		}
		.rendered-content {
			padding: 1.3rem;
		}
	}
	@media (max-width: 44rem) {
		.playground-intro {
			margin-bottom: 1.4rem;
		}
		.intro-description {
			max-width: 20rem;
			font-size: 0.8rem;
		}
		.workbench-toolbar {
			padding: 0.5rem 0 0.65rem;
			gap: 0.65rem;
		}
		.example-picker {
			width: 100%;
			gap: 1rem;
			overflow-x: auto;
		}
		.example-picker button {
			flex-shrink: 0;
			font-size: 0.68rem;
		}
		.mode-picker {
			width: 100%;
			padding-left: 0;
			border-left: 0;
		}
		.mobile-panel-picker {
			display: flex;
			gap: 1.2rem;
			padding: 0;
			border-bottom: 1px solid var(--border);
		}
		.mobile-panel-picker button {
			min-height: 2.6rem;
			padding: 0;
			border-bottom: 2px solid transparent;
			background: transparent;
			color: #93998a;
			font-size: 0.72rem;
		}
		.mobile-panel-picker button.active {
			border-bottom-color: var(--accent);
			color: var(--accent);
		}
		.editor-grid {
			height: 22rem;
			grid-template-columns: 1fr;
		}
		.editor-grid[data-mobile-panel='preview'] .source-panel,
		.editor-grid[data-mobile-panel='source'] .preview-panel {
			display: none;
		}
		.source-panel {
			border-right: 0;
		}
		.panel-header {
			min-height: 2.65rem;
			padding: 0;
		}
		.panel-footer {
			padding: 0;
			font-size: 0.58rem;
		}
		.rendered-content {
			padding: 1.35rem 0;
		}
		:global(.playground-output .markdown-svelte-heading--1) {
			font-size: 1.5rem;
		}
		.playback-bar {
			flex-wrap: wrap;
			padding: 0.75rem 0;
			gap: 0.7rem;
		}
		.playback-options {
			width: 100%;
			justify-content: space-between;
			padding: 0.65rem 0 0;
			border-top: 1px solid var(--border);
			border-left: 0;
		}
		.primary-button {
			min-width: 5.2rem;
			min-height: 2.35rem;
		}
		.playback-actions .icon-button {
			width: 1.7rem;
		}
		.playground-note {
			flex-direction: column;
			gap: 0.5rem;
			font-size: 0.61rem;
		}
		.quick-start {
			grid-template-columns: 1fr;
			gap: 1.5rem;
			margin-top: 2rem;
			padding-top: 2rem;
		}
		.code-caption {
			gap: 0.5rem;
			font-size: 0.55rem;
		}
		.code-caption code {
			font-size: 0.55rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		button,
		.switch-track,
		.switch-track::after {
			transition: none;
		}
	}
</style>
