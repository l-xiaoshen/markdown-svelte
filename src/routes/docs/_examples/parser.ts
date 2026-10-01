import { parseMarkdown, type ParsedMarkdownNode } from 'markdown-svelte'

const nodes: ParsedMarkdownNode[] = parseMarkdown('# API')
