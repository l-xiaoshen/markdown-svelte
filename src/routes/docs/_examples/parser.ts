import { parseMarkdown, type MarkdownViewerProps, type ParsedMarkdownNode } from 'markdown-svelte'

const nodes: ParsedMarkdownNode[] = parseMarkdown('# API')
