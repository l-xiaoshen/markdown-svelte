# Changelog

## 0.1.0

- Add `MarkdownRenderer` and `MarkdownRendererProps` to the main entrypoint for rendering parsed
  node arrays without animation.
- **Breaking:** Remove the `animate` prop from `MarkdownStream`. Replace
  `<MarkdownStream animate={false} ... />` with `<MarkdownRenderer ... />`. `MarkdownStream`
  uses the animated renderers and continues to respect reduced-motion preferences.
- **Breaking:** Remove the default export from `markdown-svelte/stream`. Use
  `import { MarkdownStream } from 'markdown-svelte/stream'`.
- **Breaking:** Remove `MarkdownStreamProps` and the `ParsedMarkdownNode` re-export from the
  streaming entrypoint. Import `MarkdownRendererProps` and `ParsedMarkdownNode` from
  `markdown-svelte` instead; both node renderers accept `MarkdownRendererProps`.
- Replace conditional node dispatch with typed renderer maps and separate document and rendering
  contexts. Consolidate duplicate components, props, streaming state, markup, and CSS.
- Group library internals into document, rendering, and HTML folders; colocate playground code
  and examples, and remove the duplicate `/stream/` playground route.
- Remove legacy package metadata and redundant tooling configuration. Package resolution uses
  the existing `exports` map.
- Add regression coverage for renderer modes, split diff panes, streaming text updates, and
  footnote targets and backlinks.

## 0.0.5

- Doc update.

## 0.0.4

- Fix clipping and upward jumps during streaming by fading new list items, definition items,
  footnotes, table cells, and math blocks in at their natural height instead of using slide transitions.
- Preserve reduced-motion support and update the streaming animation documentation.

## 0.0.3

- Update `stream-markdown-parser` from 1.2.14 to 1.2.17. Upstream optimizes automatic link
  detection and HTML/details merging, and fixes source matching for nested details lists with repeated
  text. Public parser declarations are unchanged; the existing finalization, node reuse, and reset
  APIs remain supported. See the
  [upstream changes](https://github.com/Simon-He95/markstream-vue/compare/stream-markdown-parser@1.2.14...stream-markdown-parser@1.2.17).
- Update Svelte to 5.57.1, the Svelte Vite plugin to 7.3.1, Vite to 8.3.1, Vitest to 5.0.2,
  and Prettier to 3.9.9, with refreshed transitive dependencies in `bun.lock`.
- Require Svelte `^5.57.1` as the peer dependency and update the installation documentation.
- Add parser integration coverage for links arriving after plain text and nested details content
  during streaming and finalization.

TypeScript 7.0.2 continues to run diagnostics through `svelte-check --tsgo`. TypeScript 6.0.3
remains required for Svelte tooling's JavaScript compiler API, as described in the
[Svelte checker setup](https://github.com/sveltejs/language-tools/blob/master/packages/svelte-check/README.md#typescript-7-supports).
