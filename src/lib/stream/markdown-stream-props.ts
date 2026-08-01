import type { HTMLAttributes } from 'svelte/elements'
import type { ParsedMarkdownNode } from '../renderable-node'

export interface MarkdownStreamProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	/** The latest parser output. Replace the array when the stream advances. */
	nodes: readonly ParsedMarkdownNode[]
	/** Animate append-only text and structural size changes. */
	animate?: boolean
	baseUrl?: string | URL
	idPrefix?: string
}
