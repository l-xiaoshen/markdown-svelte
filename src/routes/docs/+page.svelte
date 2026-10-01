<script lang="ts">
	import Seo from '../_components/Seo.svelte'
	import usageExample from './_examples/Usage.svelte?raw'
	import workerExample from './_examples/markdown.worker.ts?raw'
	import streamExample from './_examples/Stream.svelte?raw'
	import optionsExample from './_examples/Options.svelte?raw'
	import parserExample from './_examples/parser.ts?raw'
	import stylingExample from './_examples/Styling.svelte?raw'

	const props = [
		{
			name: 'markdown',
			type: 'string',
			defaultValue: 'required',
			description: 'Markdown source to parse and render.'
		},
		{
			name: 'baseUrl',
			type: 'string | URL',
			defaultValue: 'undefined',
			description: 'Resolves relative links and images against an HTTP or HTTPS document URL.'
		},
		{
			name: 'idPrefix',
			type: 'string',
			defaultValue: 'undefined',
			description: 'Namespaces heading, footnote, and local fragment IDs.'
		},
		{
			name: 'allowRawHtml',
			type: 'boolean',
			defaultValue: 'false',
			description: 'Renders sanitized raw HTML when explicitly enabled.'
		}
	]
</script>

<Seo
	title="Documentation | markdown-svelte"
	description="Install markdown-svelte and learn MarkdownViewer, streaming integration, parser types, URL resolution, and safe HTML rendering in Svelte 5."
	path="/docs/"
/>

<header class="page-header">
	<h1>markdown-svelte</h1>
	<p>
		A typed Markdown renderer for Svelte 5. It parses Markdown into nodes and renders those nodes with Svelte
		components.
	</p>
</header>

<section class="page-section">
	<h2>Installation</h2>
	<pre class="code-block"><code>npm install markdown-svelte</code></pre>
	<p><code>svelte ^5.57.1</code> is a peer dependency.</p>
</section>

<section class="page-section">
	<h2>Basic usage</h2>
	<pre class="code-block"><code>{usageExample.trim()}</code></pre>
	<p>
		The component renders an <code>&lt;article&gt;</code>. Updating <code>markdown</code> reparses the source and updates
		the rendered document.
	</p>
</section>

<section class="page-section" id="streaming">
	<h2>Streaming</h2>
	<p>
		For streaming, use <code>MarkdownStream</code> with a worker to keep parsing off the main thread.
	</p>
	<pre class="code-block"><code>npm install stream-markdown-parser</code></pre>
	<p>Save these two files together in a Vite / SvelteKit app.</p>
	<h3>1. Parse in a worker</h3>
	<p class="file-label"><code>markdown.worker.ts</code></p>
	<pre class="code-block"><code>{workerExample.trim()}</code></pre>
	<h3>2. Update at most once per frame</h3>
	<p>
		Use one pending
		<a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame">requestAnimationFrame</a>
		callback to apply the latest result at the display's refresh rate.
	</p>
	<p class="file-label"><code>Stream.svelte</code></p>
	<pre class="code-block"><code>{streamExample}</code></pre>
	<ul>
		<li>Send <code>final: true</code> with the last chunk; an empty chunk is fine.</li>
		<li>Remount the component for each new document or replay.</li>
	</ul>
</section>

<section class="page-section">
	<h2>MarkdownViewer API</h2>
	<div class="table-scroll">
		<table class="api-table">
			<thead>
				<tr>
					<th>Prop</th>
					<th>Type</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{#each props as prop}
					<tr>
						<td><code>{prop.name}</code></td>
						<td><code>{prop.type}</code></td>
						<td><code>{prop.defaultValue}</code></td>
						<td>{prop.description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p>
		Standard article attributes are also accepted and forwarded to the root element, including
		<code>class</code>, <code>aria-*</code> attributes, and event handlers.
	</p>
	<pre class="code-block"><code>{optionsExample.trim()}</code></pre>
</section>

<section class="page-section">
	<h2>Parser and types</h2>
	<p>
		Use <code>parseMarkdown</code> when an application needs the parsed node array separately from rendering. The package
		also exports the component props and parsed-node types.
	</p>
	<pre class="code-block"><code>{parserExample.trim()}</code></pre>
</section>

<section class="page-section" id="styling">
	<h2>Styling</h2>
	<p>
		No global package stylesheet is required. Set CSS custom properties on the component class for theme changes. Stable <code
			>markdown-svelte-*</code
		> classes are available for element-level overrides.
	</p>
	<pre class="code-block"><code>{stylingExample.trim()}</code></pre>
	<p>
		Base element rules use zero-specificity <code>:where(...)</code> selectors, so these overrides do not need
		<code>!important</code>. Use <code>:global(...)</code> from a scoped Svelte style block when targeting rendered descendants.
	</p>
	<p>
		The same class and variables work on <code>MarkdownStream</code>.
		<a href="/docs/styling/">See the full styling reference</a> for every element, theme variable, and streaming animation
		setting.
	</p>
</section>

<section class="page-section">
	<h2>Rendering and safety</h2>
	<ul>
		<li>Text and code are rendered through Svelte interpolation.</li>
		<li>Raw HTML is escaped by default and must be enabled with <code>allowRawHtml</code>.</li>
		<li>Enabled raw HTML is passed through the parser's safe sanitizer before rendering.</li>
		<li>Active URL schemes and protocol-relative URLs are rejected.</li>
		<li>External HTTP links receive <code>rel="noopener noreferrer"</code>.</li>
		<li>Math source is displayed without bundling a math typesetter.</li>
	</ul>
</section>

<style>
	.file-label {
		color: #6d7461;
		font-size: 0.85rem;
	}

	.code-block {
		border: 0;
		border-left: 2px solid #dce1d3;
		border-radius: 0;
		background: #f3f4ee;
	}

	.api-table {
		width: 100%;
		margin: 1.25rem 0;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	.api-table th,
	.api-table td {
		padding: 0.75rem;
		border-bottom: 1px solid #d9dde3;
		text-align: left;
		vertical-align: top;
	}

	.api-table th {
		color: #374151;
		font-size: 0.78rem;
	}

	.api-table td:last-child {
		min-width: 17rem;
	}
</style>
