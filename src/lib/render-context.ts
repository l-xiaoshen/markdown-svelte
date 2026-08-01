import { getContext, setContext, type Component } from 'svelte'
import type { DocumentAnchors } from './document-anchors'
import type { NodeProps } from './node-props'
import type { ParsedMarkdownNode } from './renderable-node'

const renderContextKey = Symbol('markdown-svelte-render-context')

export type MarkdownNodeRenderer = Component<NodeProps<ParsedMarkdownNode>>

export interface MarkdownRenderContext {
	readonly anchors: DocumentAnchors
	readonly allowRawHtml: boolean
	readonly baseUrl: string | undefined
	readonly nodeRenderer?: MarkdownNodeRenderer
	readonly animate?: boolean
}

export function provideRenderContext(context: MarkdownRenderContext): void {
	setContext(renderContextKey, context)
}

export function useRenderContext(): MarkdownRenderContext {
	const context = getContext<MarkdownRenderContext>(renderContextKey)
	if (context === undefined) {
		throw new Error('Markdown nodes must be rendered inside MarkdownViewer')
	}
	return context
}
