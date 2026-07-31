# markdown-svelte

A typed Markdown renderer for Svelte 5. Markdown is parsed into structured nodes and rendered by
owned Svelte components rather than one generated HTML string.

## Install

```sh
npm install markdown-svelte
```

`svelte >= 5.16` is a peer dependency. `stream-markdown-parser` is included as a runtime dependency.

## Use

```svelte
<script lang="ts">
	import { MarkdownViewer } from 'markdown-svelte'

	let source = $state('# Hello, **Svelte**!')
</script>

<MarkdownViewer markdown={source} />
```

## Streaming parsed nodes

Use the dedicated `markdown-svelte/stream` entrypoint when parsing happens in a worker, an SSE
consumer, or another part of the application. The component accepts the latest parsed node array and
does not parse Markdown itself:

```sh
npm install stream-markdown-parser
```

```svelte
<script lang="ts">
	import MarkdownStream, { type ParsedMarkdownNode } from 'markdown-svelte/stream'
	import { getMarkdown, parseMarkdownToStructure } from 'stream-markdown-parser'

	const parser = getMarkdown('answer')
	let source = ''
	let nodes = $state<ParsedMarkdownNode[]>([])

	function append(chunk: string, final = false) {
		source += chunk
		nodes = parseMarkdownToStructure(source, parser, { final })
	}
</script>

<MarkdownStream {nodes} />
```

Replace the `nodes` array whenever parser output changes. The renderer keys sibling positions so
completed components stay mounted while an append-only stream grows, even when the parser returns
fresh node objects. Text and inline-code additions fade in by default; other node renderers are shared
with `MarkdownViewer`.

```svelte
<MarkdownStream {nodes} animate={false} baseUrl="https://docs.example.com/" idPrefix="answer" />
```

Animation respects `prefers-reduced-motion`. Its timing can be customized with
`--markdown-stream-fade-duration` and `--markdown-stream-fade-easing`. Positional identity is intended
for append-oriented parser output; remount the component when switching it to a different document.

Resolve relative links and images against a document URL and scope generated IDs when several
documents share a page:

```svelte
<MarkdownViewer
	markdown={source}
	baseUrl="https://docs.example.com/guides/getting-started/"
	idPrefix="getting-started"
/>
```

## Component API

`MarkdownViewer` renders an `<article>` and accepts standard article attributes.

| Prop       | Type                | Default     | Purpose                                                  |
| ---------- | ------------------- | ----------- | -------------------------------------------------------- |
| `markdown` | `string`            | required    | Markdown source                                          |
| `baseUrl`  | `string \| URL`     | `undefined` | Resolve relative links and images against an HTTP(S) URL |
| `idPrefix` | `string`            | `undefined` | Namespace heading, footnote, and local fragment IDs      |
| `class`    | Svelte `ClassValue` | `undefined` | Add classes to the rendered article                      |

```svelte
<MarkdownViewer markdown={source} class={['document', { compact }]} aria-label="Rendered documentation" />
```

The root export also includes `MarkdownViewerProps`, `ParsedMarkdownNode`, and the parser:

```ts
import { parseMarkdown, type ParsedMarkdownNode } from 'markdown-svelte'

const nodes: ParsedMarkdownNode[] = parseMarkdown('# API')
```

## Syntax

The parser supports:

- Headings, paragraphs, blockquotes, lists, links, images, thematic breaks, and code blocks
- Tables, task lists, footnotes, and fenced containers such as `::: tip`
- Strikethrough, highlights, insertions, subscripts, and superscripts
- Inline and block math source
- Sanitized raw HTML
- Linkification, typographic punctuation, and Markdown line breaks
- Split rendering for parser-provided diff blocks

Math is displayed as source. The package does not bundle a math typesetter or syntax highlighter.

## Styling

No Tailwind configuration or global stylesheet is required. Every node renderer owns its markup and
styles. Theme values are inherited through CSS custom properties set on the component or an ancestor:

```css
.product-docs {
	--markdown-color-text: #172033;
	--markdown-color-muted: #64748b;
	--markdown-color-border: #d7dde7;
	--markdown-color-surface: #f5f7fa;
	--markdown-color-surface-strong: #e9edf3;
	--markdown-color-link: #075985;
	--markdown-color-accent: #a63a25;
	--markdown-color-code: #e8edf5;
	--markdown-code-background: #111827;
	--markdown-code-text: #e5edf8;
	--markdown-radius: 0.55rem;
	--markdown-font-sans: system-ui, sans-serif;
	--markdown-font-mono: ui-monospace, monospace;
}
```

```svelte
<MarkdownViewer markdown={source} class="product-docs" />
```

The default palette is neutral and light. Set the variables explicitly when the surrounding surface
is dark.

Every rendered node also has a stable `markdown-svelte-*` class. Built-in component rules use
zero-specificity `:where(...)` selectors, so normal consumer selectors override them without
`!important`:

```css
.product-docs .markdown-svelte-heading--2 {
	margin-top: 3rem;
	border-bottom: 0;
	font-family: Georgia, serif;
}

.product-docs .markdown-svelte-paragraph {
	max-width: 68ch;
	font-size: 1.05rem;
}

.product-docs .markdown-svelte-link {
	color: #be123c;
	text-decoration-style: wavy;
}

.product-docs .markdown-svelte-code-block {
	border-radius: 0;
	box-shadow: none;
}
```

Primary style hooks:

| Area           | Classes                                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Document       | `markdown-svelte`                                                                                                                        |
| Typography     | `markdown-svelte-heading`, `markdown-svelte-heading--1` through `--6`, `markdown-svelte-paragraph`                                       |
| Inline         | `markdown-svelte-link`, `markdown-svelte-inline-code`, `markdown-svelte-strong`, `markdown-svelte-emphasis`, `markdown-svelte-highlight` |
| Lists          | `markdown-svelte-list`, `markdown-svelte-list--ordered`, `markdown-svelte-list-item`, `markdown-svelte-checkbox`                         |
| Blocks         | `markdown-svelte-blockquote`, `markdown-svelte-admonition`, `markdown-svelte-container`                                                  |
| Code           | `markdown-svelte-code-block`, `markdown-svelte-code-header`, `markdown-svelte-code-pre`, `markdown-svelte-code-copy`                     |
| Tables         | `markdown-svelte-table-wrapper`, `markdown-svelte-table`, `markdown-svelte-table-row`, `markdown-svelte-table-cell`                      |
| Footnotes      | `markdown-svelte-footnote`, `markdown-svelte-footnote-reference`, `markdown-svelte-footnote-backlink`                                    |
| Media and HTML | `markdown-svelte-image`, `markdown-svelte-html-block`, `markdown-svelte-html-inline`                                                     |

Inside a Svelte component's scoped `<style>`, wrap selectors with `:global(...)` when targeting the
renderer's descendants.

## Security

Normal Markdown text and code are rendered through Svelte interpolation. Raw HTML is passed through
`stream-markdown-parser`'s safe sanitizer before `{@html}` is used. Scripts, embedded content, event
handlers, styles, dangerous attributes, and active URL schemes are removed or rejected.

Markdown links allow HTTP, HTTPS, email, telephone, fragment, root-relative, and relative URLs.
Images use the parser's stricter image policy, which excludes active schemes and SVG data URLs.
Protocol-relative URLs are rejected. External HTTP links open in a new tab with
`rel="noopener noreferrer"`.

Sanitization is not a replacement for application-level controls. For high-risk content, also use a
Content Security Policy and resource limits.

## Organization

The package mirrors the ownership boundaries of the reference implementation:

```text
src/lib/markdown/
  markdown-viewer.svelte    public component and document orchestration
  markdown-renderer.svelte  shared parsed-node document shell
  parser.ts                 parser configuration
  node-list.svelte          recursive list renderer
  node.svelte               node-type dispatcher
  document-anchors.ts       heading and footnote identity
  paragraph-segments.ts     valid paragraph/block boundaries
  nodes/                    one Svelte renderer per node type
src/lib/stream/
  markdown-stream.svelte    parsed-node streaming entrypoint
  node.svelte               stream-aware node dispatcher
  nodes/                    append-animation renderers
```

Implementation-only modules are not re-exported. The package root exposes the static component,
parser, and public types; `markdown-svelte/stream` exposes the parsed-node streaming component.

## Development

This repository follows the [SvelteKit packaging guide](https://svelte.dev/docs/kit/packaging):

- `src/lib` is the package source.
- `src/routes` is the local documentation and playground app.
- `svelte-package` generates `dist` and type declarations.
- `publint` validates the packed result.

```sh
bun install
bun run dev
bun run test
bun run check
bun run prepack
```

Development pages:

- `/` contains the package overview and live output.
- `/playground` provides an editor and AST inspection.
- `/examples` demonstrates syntax, sanitization, ID scoping, and relative URL resolution.

## License

MIT
