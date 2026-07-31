import type { HTMLAttributes } from 'svelte/elements'
import type { ParsedMarkdownNode } from '../markdown/renderable-node'

export interface MarkdownStreamProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	/** The latest parser output. Replace the array when the stream advances. */
	nodes: readonly ParsedMarkdownNode[]
	/** Fade append-only updates to text and inline code. */
	animate?: boolean
	baseUrl?: string | URL
	idPrefix?: string
}
