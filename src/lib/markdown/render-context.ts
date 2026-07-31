import { getContext, setContext } from 'svelte'
import type { DocumentAnchors } from './document-anchors'

const renderContextKey = Symbol('markdown-svelte-render-context')

export interface MarkdownRenderContext {
	readonly anchors: DocumentAnchors
	readonly baseUrl: string | undefined
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
