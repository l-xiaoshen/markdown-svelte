<script lang="ts">
	import { MarkdownViewer } from '$lib/index'

	const basicMarkdown = `# Project notes

This paragraph has **strong text**, _emphasis_, and a [link](https://svelte.dev).

- First item
- Second item

> Markdown is rendered as semantic Svelte markup.`

	const extendedMarkdown = `## Release checklist

- [x] Render task lists
- [x] Render tables
- [ ] Publish the package

| Feature | Status |
| --- | ---: |
| Server rendering | Ready |
| Relative links | Ready |

~~~ts
import { MarkdownViewer } from 'markdown-svelte'
~~~

Footnote references include a return link.[^note]

[^note]: This is the footnote content.`

	const optionsMarkdown = `# Guide

Relative links resolve against \`baseUrl\`, and generated IDs use the configured prefix.

## Installation

Open the [API reference](./api) for the next step.`

	const styledMarkdown = `## Custom heading

Use CSS variables for a theme and public classes for individual elements.

\`inline code\` and [links](https://example.com) inherit the custom colors.`

	const styledExample = [
		'<MarkdownViewer markdown={source} class="custom-document" />',
		'',
		'<' + 'style>',
		'\t:global(.custom-document) {',
		'\t\t--markdown-color-link: #7c3aed;',
		'\t\t--markdown-color-surface: #f5f3ff;',
		'\t}',
		'',
		'\t:global(.custom-document .markdown-svelte-heading--2) {',
		'\t\tborder-bottom: 2px solid #7c3aed;',
		'\t}',
		'<' + '/style>'
	].join('\n')
</script>

<svelte:head>
	<title>Examples | markdown-svelte</title>
	<meta name="description" content="Rendered markdown-svelte usage examples." />
</svelte:head>

<header class="page-header">
	<h1>Examples</h1>
	<p>Markdown source and the corresponding output from <code>MarkdownViewer</code>.</p>
</header>

<section class="example-section">
	<header>
		<h2>Basic Markdown</h2>
		<p>Headings, inline formatting, links, lists, and blockquotes use semantic HTML elements.</p>
	</header>
	<div class="example-grid">
		<div class="example-panel source-panel">
			<h3>Source</h3>
			<pre><code>{basicMarkdown}</code></pre>
		</div>
		<div class="example-panel output-panel">
			<h3>Output</h3>
			<div class="rendered-output">
				<MarkdownViewer markdown={basicMarkdown} idPrefix="basic" />
			</div>
		</div>
	</div>
</section>

<section class="example-section">
	<header>
		<h2>Extended syntax</h2>
		<p>Task lists, tables, fenced code, and footnotes are supported by the parser.</p>
	</header>
	<div class="example-grid">
		<div class="example-panel source-panel">
			<h3>Source</h3>
			<pre><code>{extendedMarkdown}</code></pre>
		</div>
		<div class="example-panel output-panel">
			<h3>Output</h3>
			<div class="rendered-output">
				<MarkdownViewer markdown={extendedMarkdown} idPrefix="extended" />
			</div>
		</div>
	</div>
</section>

<section class="example-section">
	<header>
		<h2>Document options</h2>
		<p>
			This output resolves its relative link against <code>baseUrl</code> and prefixes generated IDs with
			<code>guide</code>.
		</p>
	</header>
	<div class="example-grid">
		<div class="example-panel source-panel">
			<h3>Source</h3>
			<pre><code>{optionsMarkdown}</code></pre>
		</div>
		<div class="example-panel output-panel">
			<h3>Output</h3>
			<div class="rendered-output">
				<MarkdownViewer markdown={optionsMarkdown} baseUrl="https://docs.example.com/guide/" idPrefix="guide" />
			</div>
		</div>
	</div>
</section>

<section class="example-section">
	<header>
		<h2>Style overrides</h2>
		<p>Theme variables and public node classes can be combined on the same component.</p>
	</header>
	<div class="example-grid">
		<div class="example-panel source-panel">
			<h3>Component and CSS</h3>
			<pre><code>{styledExample}</code></pre>
		</div>
		<div class="example-panel output-panel">
			<h3>Output</h3>
			<div class="rendered-output">
				<MarkdownViewer markdown={styledMarkdown} class="custom-document" idPrefix="styled" />
			</div>
		</div>
	</div>
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

	.example-grid {
		display: grid;
		border: 1px solid #d9dde3;
		border-radius: 0.4rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		overflow: hidden;
	}

	.example-panel {
		min-width: 0;
	}

	.example-panel + .example-panel {
		border-left: 1px solid #d9dde3;
	}

	.example-panel h3 {
		margin: 0;
		padding: 0.7rem 1rem;
		border-bottom: 1px solid #d9dde3;
		background: #f7f8fa;
		color: #4b5563;
		font-size: 0.75rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.source-panel pre {
		box-sizing: border-box;
		min-height: 100%;
		margin: 0;
		padding: 1.25rem;
		overflow-x: auto;
		background: #fbfcfd;
		font-size: 0.78rem;
		line-height: 1.65;
		white-space: pre-wrap;
	}

	.rendered-output {
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	:global(.custom-document) {
		--markdown-color-link: #7c3aed;
		--markdown-color-surface: #f5f3ff;
	}

	:global(.custom-document .markdown-svelte-heading--2) {
		border-bottom: 2px solid #7c3aed;
	}

	@media (max-width: 48rem) {
		.example-grid {
			grid-template-columns: 1fr;
		}

		.example-panel + .example-panel {
			border-top: 1px solid #d9dde3;
			border-left: 0;
		}
	}
</style>
