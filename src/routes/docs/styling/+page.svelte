<script lang="ts">
	import Seo from '../../_components/Seo.svelte'
	import setupExample from './_examples/Setup.svelte?raw'
	import documentCss from './_examples/document.css?raw'
	import typographyCss from './_examples/typography.css?raw'
	import inlineCss from './_examples/inline.css?raw'
	import listsCss from './_examples/lists.css?raw'
	import blocksCss from './_examples/blocks.css?raw'
	import codeCss from './_examples/code.css?raw'
	import tablesCss from './_examples/tables.css?raw'
	import imagesCss from './_examples/images.css?raw'
	import mathCss from './_examples/math.css?raw'
	import footnotesCss from './_examples/footnotes.css?raw'
	import htmlCss from './_examples/html.css?raw'
	import motionExample from './_examples/motion.css?raw'

	const themeVariables = [
		['--markdown-color-text', '#253044', 'Document text.'],
		['--markdown-color-muted', '#667085', 'Secondary text, blockquotes, and fallback labels.'],
		['--markdown-color-border', '#d7dde7', 'Rules, table borders, and element outlines.'],
		['--markdown-color-surface', '#f5f7fa', 'Blockquotes, containers, and math blocks.'],
		['--markdown-color-surface-strong', '#e9edf3', 'Table headers.'],
		['--markdown-color-link', '#0b62c4', 'Links and footnote navigation.'],
		['--markdown-color-accent', '#087164', 'Blockquote borders, checkboxes, and default admonitions.'],
		['--markdown-color-code', '#e8edf5', 'Inline code and inline math backgrounds.'],
		['--markdown-code-background', '#111827', 'Fenced code block background.'],
		['--markdown-code-text', '#e5edf8', 'Fenced code block text.'],
		['--markdown-radius', '0.55rem', 'Block, table, and image corners. Inline code and math have their own radius.'],
		[
			'--markdown-font-sans',
			"ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
			'Document font family.'
		],
		['--markdown-font-mono', "'SFMono-Regular', Consolas, 'Liberation Mono', monospace", 'Code and math font family.']
	]

	const elements = [
		{
			id: 'document',
			title: 'Document',
			note: 'The class prop is added to the root article. Scope overrides to that class when a page has several documents.',
			hooks: [
				['.markdown-svelte', 'Root article for both renderers; also has [data-markdown-svelte].'],
				['.markdown-svelte-stream', 'Additional root class for MarkdownStream; also has [data-markdown-svelte-stream].']
			],
			css: documentCss
		},
		{
			id: 'typography',
			title: 'Headings and paragraphs',
			note: 'Use the level modifier to change one heading level. Set overall text size and line height on the document.',
			hooks: [
				['.markdown-svelte-heading', 'All headings, h1 through h6.'],
				[
					'.markdown-svelte-heading--1, .markdown-svelte-heading--2, .markdown-svelte-heading--3, .markdown-svelte-heading--4, .markdown-svelte-heading--5, .markdown-svelte-heading--6',
					'Individual heading levels.'
				],
				['.markdown-svelte-paragraph', 'Paragraph (p).'],
				['.markdown-svelte-inline', 'Inline group (span).'],
				['.markdown-svelte-text', 'Text node wrapper (span).'],
				['.markdown-svelte-hardbreak', 'Explicit line break (br).']
			],
			css: typographyCss
		},
		{
			id: 'inline',
			title: 'Inline formatting and links',
			note: 'Highlights and other inline details can be styled directly when the theme variables do not cover them.',
			hooks: [
				['.markdown-svelte-strong', 'Bold text (strong).'],
				['.markdown-svelte-emphasis', 'Emphasis (em).'],
				['.markdown-svelte-strikethrough', 'Deleted text (del).'],
				['.markdown-svelte-highlight', 'Highlighted text (mark).'],
				['.markdown-svelte-insert', 'Inserted text (ins).'],
				['.markdown-svelte-subscript', 'Subscript (sub).'],
				['.markdown-svelte-superscript', 'Superscript (sup).'],
				['.markdown-svelte-inline-code', 'Inline code (code).'],
				['.markdown-svelte-link', 'Markdown link (a).'],
				['.markdown-svelte-emoji', 'Emoji wrapper (span).'],
				['.markdown-svelte-reference', 'Unresolved reference text (span).']
			],
			css: inlineCss
		},
		{
			id: 'lists',
			title: 'Lists and definitions',
			note: 'Task checkboxes are disabled display elements. Definition classes apply to definition-list nodes supplied by the parser.',
			hooks: [
				['.markdown-svelte-list', 'Ordered and unordered lists.'],
				['.markdown-svelte-list--ordered', 'Ordered list (ol).'],
				['.markdown-svelte-list--unordered', 'Unordered list (ul).'],
				['.markdown-svelte-list-item', 'List item (li).'],
				['.markdown-svelte-list-item--task', 'Task-list item modifier.'],
				['.markdown-svelte-task-content', 'Task item content wrapper (div).'],
				['.markdown-svelte-checkbox', 'Disabled checkbox (input).'],
				['.markdown-svelte-definition-list', 'Definition list (dl).'],
				['.markdown-svelte-definition-term', 'Definition term (dt).'],
				['.markdown-svelte-definition-description', 'Definition body (dd).']
			],
			css: listsCss
		},
		{
			id: 'blocks',
			title: 'Quotes, callouts, and rules',
			note: 'Admonitions expose their lowercase kind through data-kind, such as warning, caution, danger, or error. Generic containers have a separate title class.',
			hooks: [
				['.markdown-svelte-blockquote', 'Blockquote.'],
				['.markdown-svelte-thematic-break', 'Thematic break (hr).'],
				['.markdown-svelte-admonition', 'Admonition wrapper (aside).'],
				['.markdown-svelte-admonition-title', 'Admonition title (strong).'],
				['.markdown-svelte-container', 'Generic fenced container (aside).'],
				['.markdown-svelte-container-title', 'Container title (strong).']
			],
			css: blocksCss
		},
		{
			id: 'code',
			title: 'Code blocks and diffs',
			note: 'Code is rendered as text; no syntax highlighter is bundled. Diff blocks show split panes when the node includes originalCode or updatedCode. The copy button exposes data-state="idle", "copied", or "failed".',
			hooks: [
				['.markdown-svelte-code-block', 'Outer code block (div).'],
				['.markdown-svelte-code-header', 'Language and copy toolbar (div).'],
				['.markdown-svelte-code-language', 'Language label (span).'],
				['.markdown-svelte-code-copy', 'Copy button (button).'],
				['.markdown-svelte-code-pre', 'Code surface (pre); contains code.'],
				['.markdown-svelte-diff', 'Split diff layout (div).'],
				['.markdown-svelte-diff-pane', 'Diff pane (section).'],
				[
					'.markdown-svelte-diff-pane--original, .markdown-svelte-diff-pane--updated',
					'Original and updated pane modifiers.'
				],
				['.markdown-svelte-diff-label', 'Pane label (strong).']
			],
			css: codeCss
		},
		{
			id: 'tables',
			title: 'Tables',
			note: 'Keep horizontal scrolling on the wrapper for narrow screens. Column alignment comes from Markdown alignment markers and is applied as an inline text-align style on each cell.',
			hooks: [
				['.markdown-svelte-table-wrapper', 'Scrollable table wrapper (div).'],
				['.markdown-svelte-table', 'Table.'],
				['.markdown-svelte-table-head', 'Header group (thead).'],
				['.markdown-svelte-table-body', 'Body group (tbody).'],
				['.markdown-svelte-table-row', 'Table row (tr).'],
				['.markdown-svelte-table-cell', 'All header and body cells.'],
				['.markdown-svelte-table-cell--header', 'Header cell (th).'],
				['.markdown-svelte-table-cell--body', 'Body cell (td).']
			],
			css: tablesCss
		},
		{
			id: 'images',
			title: 'Images',
			note: 'Images fit their container by default. The fallback span displays alt text when the source URL is missing or rejected by the URL policy.',
			hooks: [
				['.markdown-svelte-image', 'Image (img).'],
				['.markdown-svelte-image-fallback', 'Alt-text fallback (span).']
			],
			css: imagesCss
		},
		{
			id: 'math',
			title: 'Math',
			note: 'Math is displayed as source text. Styling these elements does not typeset the expression; no math renderer is bundled.',
			hooks: [
				['.markdown-svelte-math-inline', 'Inline math source (code).'],
				['.markdown-svelte-math-block', 'Block math source (pre); contains code.']
			],
			css: mathCss
		},
		{
			id: 'footnotes',
			title: 'Footnotes',
			note: 'Style classes rather than generated IDs. idPrefix namespaces IDs when multiple rendered documents share a page.',
			hooks: [
				['.markdown-svelte-footnote', 'Footnote definition wrapper (div).'],
				['.markdown-svelte-footnote-label', 'Definition number (sup).'],
				['.markdown-svelte-footnote-content', 'Definition content (div).'],
				['.markdown-svelte-footnote-reference', 'Inline reference (sup).'],
				['.markdown-svelte-footnote-reference-link', 'Link from a reference to its definition (a).'],
				['.markdown-svelte-footnote-backlink', 'Return link to the reference (a).']
			],
			css: footnotesCss
		},
		{
			id: 'html',
			title: 'HTML and fallbacks',
			note: 'Raw HTML is escaped by default. With allowRawHtml, sanitized HTML is rendered inside these wrappers. Its descendants do not receive Markdown classes; target their tags beneath your document class.',
			hooks: [
				['.markdown-svelte-html-block', 'Sanitized HTML block wrapper (div).'],
				['.markdown-svelte-html-inline', 'Sanitized inline HTML wrapper (span).'],
				['.markdown-svelte-html-escaped', 'Escaped HTML source (span).'],
				['.markdown-svelte-fallback', 'Raw source for an unsupported node (span).']
			],
			css: htmlCss
		}
	]

	const motionVariables = [
		['--markdown-stream-fade-duration', '280ms', 'Appended text and inline-code fades.'],
		['--markdown-stream-fade-easing', 'cubic-bezier(0.33, 0, 0.67, 1)', 'Appended text fade easing.'],
		['--markdown-stream-line-duration', '110ms', 'New block lines, list items, cells, and atomic inline nodes.'],
		['--markdown-stream-line-easing', 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', 'New line and item easing.'],
		['--markdown-stream-size-duration', '180ms', 'Code- and math-block height transitions.'],
		['--markdown-stream-size-easing', 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', 'Height transition easing.'],
		['--markdown-stream-enter-duration', '160ms', 'Container and thematic-break entrances.'],
		['--markdown-stream-enter-easing', 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', 'Container and thematic-break easing.'],
		['--markdown-stream-media-duration', '180ms', 'Image reveal after loading.']
	]

	const motionHooks = [
		['.markdown-svelte-stream-delta', 'Temporary span around newly appended text.'],
		['.markdown-svelte-stream-list-item', 'Animated list item.'],
		['.markdown-svelte-stream-definition-item', 'Wrapper around a definition term and body.'],
		['.markdown-svelte-stream-footnote', 'Animated footnote definition.'],
		['.markdown-svelte-stream-table-cell', 'Inner cell content wrapper.'],
		['.markdown-svelte-stream-math-block', 'Animated block math.'],
		[
			'.markdown-svelte-stream-code-size, .markdown-svelte-stream-math-size',
			'Elements with managed height transitions.'
		],
		['.markdown-svelte-stream-block-enter', 'Blockquote, admonition, and container entrance.'],
		['.markdown-svelte-stream-rule', 'Thematic-break entrance.'],
		['.markdown-svelte-stream-code-language', 'Language label entrance.'],
		['.markdown-svelte-stream-image, .markdown-svelte-stream-image--loaded', 'Image reveal and loaded state.']
	]
</script>

<Seo
	title="Styling and themes | markdown-svelte"
	description="Customize markdown-svelte with CSS variables, element classes, theme examples, and streaming animation controls for Svelte 5."
	path="/docs/styling/"
/>

<header class="page-header">
	<a class="back-link" href="/docs/#styling">← Docs</a>
	<h1>Styling</h1>
	<p>
		Set theme variables for a whole document, or target individual elements with CSS.
		<code>MarkdownViewer</code> and <code>MarkdownStream</code> share the same element classes.
	</p>
</header>

<nav class="contents" aria-label="Styling contents">
	<a href="#setup">Setup</a>
	<a href="#theme">Theme variables</a>
	<a href="#elements">Element reference</a>
	<a href="#motion">Streaming motion</a>
</nav>

<section class="page-section" id="setup">
	<h2>Setup</h2>
	<p>
		Pass a class to the component and place overrides in your stylesheet. No package stylesheet or Tailwind
		configuration is required. In a Svelte <code>&lt;style&gt;</code> block, use <code>:global(...)</code> so selectors reach
		the child renderer's markup.
	</p>
	<pre class="code-block"><code>{setupExample.trimEnd()}</code></pre>
	<p>
		In a global CSS file, omit <code>:global(...)</code>. The examples below use that form. Base element styles use
		<code>:where(...)</code> to keep specificity low, so ordinary class selectors can override them. Existing app styles
		for tags such as <code>a</code> or <code>code</code> can also take precedence; use a scoped element selector when needed.
	</p>
</section>

<section class="page-section" id="theme">
	<h2>Theme variables</h2>
	<p>
		Set these on the component's class or an ancestor. Font size, line height, spacing, and document background use
		normal CSS properties. The default palette is light; set colors explicitly for a dark surface.
	</p>
	<div class="table-scroll">
		<table class="reference-table variables">
			<caption>Document theme defaults</caption>
			<thead><tr><th scope="col">Variable</th><th scope="col">Default</th><th scope="col">Applies to</th></tr></thead>
			<tbody>
				{#each themeVariables as [name, value, purpose]}
					<tr><th scope="row"><code>{name}</code></th><td><code>{value}</code></td><td>{purpose}</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p>
		These variables cover shared theme values. Use element classes for details such as highlight colors, code-toolbar
		colors, or inline-code corners. Properties beginning with <code>--_markdown-</code> are internal resolved values.
	</p>
</section>

<section class="page-section" id="elements">
	<h2>Element reference</h2>
	<p>Every class below includes the full selector. Some elements only appear for the corresponding parser node type.</p>
	<nav class="contents element-contents" aria-label="Element groups">
		{#each elements as group}
			<a href={'#' + group.id}>{group.title}</a>
		{/each}
	</nav>
	{#each elements as group}
		<section class="element-group" id={group.id}>
			<h3>{group.title}</h3>
			<p>{group.note}</p>
			<div class="table-scroll">
				<table class="reference-table hooks">
					<caption>{group.title} selectors</caption>
					<thead><tr><th scope="col">Selector</th><th scope="col">Element</th></tr></thead>
					<tbody>
						{#each group.hooks as [selector, description]}
							<tr><th scope="row"><code>{selector}</code></th><td>{description}</td></tr>
						{/each}
					</tbody>
				</table>
			</div>
			<pre class="code-block"><code>{group.css.trimEnd()}</code></pre>
		</section>
	{/each}
</section>

<section class="page-section" id="motion">
	<h2>Streaming motion</h2>
	<p>
		Set these variables on your <code>MarkdownStream</code> class to adjust animation timing. Motion respects
		<code>prefers-reduced-motion</code>. To turn it off, pass <code>{'animate={false}'}</code> to the component.
	</p>
	<pre class="code-block"><code>{motionExample.trimEnd()}</code></pre>
	<div class="table-scroll">
		<table class="reference-table variables">
			<caption>Streaming animation defaults</caption>
			<thead><tr><th scope="col">Variable</th><th scope="col">Default</th><th scope="col">Applies to</th></tr></thead>
			<tbody>
				{#each motionVariables as [name, value, purpose]}
					<tr><th scope="row"><code>{name}</code></th><td><code>{value}</code></td><td>{purpose}</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
	<h3>Additional streaming classes</h3>
	<p>
		The renderer adds these classes for animated content. Prefer timing variables for motion changes. Code and math
		heights are calculated by the renderer; overriding their height, vertical padding, or overflow can interfere with
		sizing during a stream.
	</p>
	<div class="table-scroll">
		<table class="reference-table hooks">
			<caption>Additional streaming selectors</caption>
			<thead><tr><th scope="col">Selector</th><th scope="col">Element</th></tr></thead>
			<tbody>
				{#each motionHooks as [selector, description]}
					<tr><th scope="row"><code>{selector}</code></th><td>{description}</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p><a href="/docs/#streaming">See the streaming guide</a> for worker parsing and frame-paced state updates.</p>
</section>

<style>
	.back-link {
		display: inline-block;
		margin-bottom: 1.5rem;
		color: #6d7461;
		font-size: 0.9rem;
	}

	.contents {
		display: flex;
		max-width: 56rem;
		flex-wrap: wrap;
		gap: 0.75rem 1.75rem;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.contents a {
		color: #59634a;
		text-underline-offset: 0.25em;
	}

	.element-contents {
		margin-top: 1.5rem;
		font-size: 0.9rem;
	}

	.element-group {
		padding-block: 1rem;
		border-top: 1px solid #e3e6db;
	}

	.element-group h3 {
		margin-top: 1rem;
		font-size: 1.2rem;
	}

	section {
		scroll-margin-top: 2rem;
	}

	.code-block {
		border: 0;
		border-left: 2px solid #dce1d3;
		border-radius: 0;
		background: #f3f4ee;
	}

	.reference-table {
		width: 100%;
		margin-block: 1.25rem;
		border-collapse: collapse;
		font-size: 0.85rem;
		line-height: 1.6;
	}

	.reference-table caption {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	.reference-table th,
	.reference-table td {
		padding: 0.75rem 1rem 0.75rem 0;
		border-bottom: 1px solid #e3e6db;
		text-align: left;
		vertical-align: top;
	}

	.reference-table thead th {
		color: #6d7461;
		font-weight: 600;
	}

	.reference-table tbody th {
		font-weight: 400;
	}

	.variables {
		min-width: 48rem;
		table-layout: fixed;
	}

	.variables th:first-child {
		width: 36%;
	}

	.variables td:nth-child(2) {
		overflow-wrap: anywhere;
	}

	.hooks {
		min-width: 36rem;
		table-layout: fixed;
	}

	.hooks th:first-child {
		width: 56%;
	}

	.hooks code {
		overflow-wrap: anywhere;
	}
</style>
