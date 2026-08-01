<script lang="ts">
	const installExample = `npm install markdown-svelte`

	const usageExample = [
		'<' + 'script lang="ts">',
		"\timport { MarkdownViewer } from 'markdown-svelte'",
		'',
		"\tlet source = $state('# Hello, **Svelte**!')",
		'<' + '/script>',
		'',
		'<MarkdownViewer markdown={source} />'
	].join('\n')

	const optionsExample = `<MarkdownViewer
	markdown={source}
	baseUrl="https://docs.example.com/guide/"
	idPrefix="guide"
	class="documentation"
	aria-label="Rendered documentation"
/>`

	const parserExample = `import {
	parseMarkdown,
	type MarkdownViewerProps,
	type ParsedMarkdownNode
} from 'markdown-svelte'

const nodes: ParsedMarkdownNode[] = parseMarkdown('# API')`

	const stylingExample = `:global(.documentation) {
	--markdown-color-text: #172033;
	--markdown-color-link: #075985;
	--markdown-color-surface: #f5f7fa;
	--markdown-radius: 0.4rem;
}

:global(.documentation .markdown-svelte-heading--2) {
	border-bottom: 0;
}`

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

<svelte:head>
	<title>markdown-svelte documentation</title>
</svelte:head>

<header class="page-header">
	<h1>markdown-svelte</h1>
	<p>
		A typed Markdown renderer for Svelte 5. It parses Markdown into nodes and renders those nodes with Svelte
		components.
	</p>
</header>

<section class="page-section">
	<h2>Installation</h2>
	<pre class="code-block"><code>{installExample}</code></pre>
	<p><code>svelte &gt;= 5.16</code> is a peer dependency.</p>
</section>

<section class="page-section">
	<h2>Basic usage</h2>
	<pre class="code-block"><code>{usageExample}</code></pre>
	<p>
		The component renders an <code>&lt;article&gt;</code>. Updating <code>markdown</code> reparses the source and updates
		the rendered document.
	</p>
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
	<pre class="code-block"><code>{optionsExample}</code></pre>
</section>

<section class="page-section">
	<h2>Parser and types</h2>
	<p>
		Use <code>parseMarkdown</code> when an application needs the parsed node array separately from rendering. The package
		also exports the component props and parsed-node types.
	</p>
	<pre class="code-block"><code>{parserExample}</code></pre>
</section>

<section class="page-section">
	<h2>Styling</h2>
	<p>
		No global package stylesheet is required. Set CSS custom properties on the component class for theme changes. Stable <code
			>markdown-svelte-*</code
		> classes are available for element-level overrides.
	</p>
	<pre class="code-block"><code>{stylingExample}</code></pre>
	<p>
		Built-in rules use zero-specificity <code>:where(...)</code> selectors, so these overrides do not need
		<code>!important</code>. Use <code>:global(...)</code> from a scoped Svelte style block when targeting rendered descendants.
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
	.api-table {
		width: 100%;
		margin: 1.25rem 0;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	.api-table th,
	.api-table td {
		padding: 0.75rem;
		border: 1px solid #d9dde3;
		text-align: left;
		vertical-align: top;
	}

	.api-table th {
		background: #f7f8fa;
		color: #374151;
		font-size: 0.78rem;
	}

	.api-table td:last-child {
		min-width: 17rem;
	}
</style>
