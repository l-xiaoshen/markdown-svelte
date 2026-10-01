import { createContext } from 'svelte'
import type { NodeRendererMap } from './registry'

export interface MarkdownRenderContext {
	readonly renderers: NodeRendererMap
	readonly animate: boolean
}

export const [useRenderContext, provideRenderContext] = createContext<MarkdownRenderContext>()
