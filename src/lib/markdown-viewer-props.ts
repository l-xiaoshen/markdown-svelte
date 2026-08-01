import type { HTMLAttributes } from 'svelte/elements'

export interface MarkdownViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	markdown: string
	/** Render sanitized raw HTML from the Markdown source. */
	allowRawHtml?: boolean
	baseUrl?: string | URL
	idPrefix?: string
}
