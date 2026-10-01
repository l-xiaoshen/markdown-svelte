import type { HTMLAttributes } from 'svelte/elements'
import type { ParsedMarkdownNode } from './renderable-node'

export interface MarkdownProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	/** Render sanitized raw HTML from the Markdown source. */
	allowRawHtml?: boolean
	baseUrl?: string | URL
	idPrefix?: string
}

export interface MarkdownRendererProps extends MarkdownProps {
	/** Parsed Markdown nodes. Replace the array when the document changes. */
	nodes: readonly ParsedMarkdownNode[]
}

export interface MarkdownViewerProps extends MarkdownProps {
	markdown: string
}
