# markdown-svelte

A typed Markdown renderer for Svelte 5 with streaming support and customizable styles.

[Playground](https://markdown-svelte.pages.dev/) · [Documentation](https://markdown-svelte.pages.dev/docs/) · [Examples](https://markdown-svelte.pages.dev/examples/)

## Install

```sh
npm install markdown-svelte
```

Requires `svelte ^5.57.1`.

## Usage

```svelte
<script lang="ts">
	import { MarkdownViewer } from 'markdown-svelte'
</script>

<MarkdownViewer markdown="# Hello, **Svelte**!" />
```

For parsed node arrays, use `MarkdownRenderer` from `markdown-svelte`. It accepts
`nodes` and renders updates without animation.

Use `MarkdownStream` from `markdown-svelte/stream` to animate incoming node updates.
Both components accept the same props. See the
[worker example](https://markdown-svelte.pages.dev/docs/#streaming) for incremental parsing.

Customize the appearance with CSS variables and element classes. See the
[styling guide](https://markdown-svelte.pages.dev/docs/styling/).

Raw HTML is disabled by default. Set `allowRawHtml` to render sanitized HTML.

## Development

```sh
cp .env.example .env
bun install
bun run dev
```

Run `bun run check` and `bun run test` to validate changes. `bun run build` builds the site and package.
Set `PUBLIC_BASE_URL` in the deployment environment when building the documentation site.

## License

MIT
