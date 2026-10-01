# Code blocks

Use backticks for `inline code` and fenced blocks for multiple lines.

## Svelte

```svelte
<script lang="ts">
	import { MarkdownViewer } from 'markdown-svelte'

	let source = $state('# Hello, **Svelte**!')
</script>

<MarkdownViewer markdown={source} />
```

## Parsing streamed text

```ts
import { getMarkdown, parseMarkdownToStructure } from 'stream-markdown-parser'

const parser = getMarkdown('answer')
let buffer = ''

function append(chunk: string, final = false) {
	buffer += chunk
	return parseMarkdownToStructure(buffer, parser, {
		final,
		reuseStableTopLevelNodes: true
	})
}
```

> The language after the opening fence labels the code block.
