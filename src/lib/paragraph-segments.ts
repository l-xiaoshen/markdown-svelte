import type { ParagraphNode } from 'stream-markdown-parser'
import { canRenderHtmlSourceAtRoot, isBlockContent } from './html-elements'
import type { ParsedMarkdownNode } from './renderable-node'
import { isNodeType } from './renderable-node'

export type ParagraphSegment =
	| { kind: 'inline'; nodes: ParsedMarkdownNode[] }
	| { kind: 'block'; node: ParsedMarkdownNode }
	| { kind: 'html'; source: string; canRender: boolean }

export function paragraphSegments(paragraph: ParagraphNode): ParagraphSegment[] {
	const segments: ParagraphSegment[] = []
	let inline: ParsedMarkdownNode[] = []

	function flushInline(): void {
		if (inline.length === 0) {
			return
		}
		segments.push({ kind: 'inline', nodes: inline })
		inline = []
	}

	for (const child of paragraph.children) {
		if (!isBlockContent(child)) {
			inline.push(child)
			continue
		}

		flushInline()
		if (isNodeType(child, 'paragraph') && child.raw.trimStart().startsWith('<')) {
			segments.push({
				kind: 'html',
				source: child.raw,
				canRender: canRenderHtmlSourceAtRoot(child.raw)
			})
			continue
		}
		segments.push({ kind: 'block', node: child })
	}

	flushInline()
	return segments
}
