import { createContext } from 'svelte'
import type { DocumentAnchors } from './anchors'

export interface MarkdownDocumentContext {
	readonly anchors: DocumentAnchors
	readonly allowRawHtml: boolean
	readonly baseUrl: string | undefined
}

export const [useDocumentContext, provideDocumentContext] = createContext<MarkdownDocumentContext>()
