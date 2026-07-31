import type { HTMLAttributes } from 'svelte/elements'

export interface MarkdownViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	markdown: string
	baseUrl?: string | URL
	idPrefix?: string
}
