import { describe, expect, it } from 'vitest'
import { createDocumentAnchors, headingAnchorBase, headingText } from './document-anchors'
import { parseMarkdown } from './parser'
import { isNodeType } from './renderable-node'

describe('document anchors', () => {
	it('creates readable and globally unique heading IDs', () => {
		const nodes = parseMarkdown('# Foo\n\n# Foo\n\n# Foo-1\n\n# Customer 表')
		const headings = nodes.filter((node) => isNodeType(node, 'heading'))
		const anchors = createDocumentAnchors(nodes, 'Docs')

		expect(headings.map((heading) => anchors.headingIds.get(heading))).toEqual([
			'docs-foo',
			'docs-foo-1',
			'docs-foo-1-1',
			'docs-customer-表'
		])
		expect(anchors.fragments.get('foo-1')).toBe('docs-foo-1')
	})

	it('uses rendered heading text and a stable fallback', () => {
		const heading = parseMarkdown('# <kbd>Typed</kbd> `API`').find((node) => isNodeType(node, 'heading'))

		expect(heading ? headingText(heading) : undefined).toBe('Typed API')
		expect(headingAnchorBase('***')).toBe('section')
	})

	it('only reserves raw HTML IDs when raw HTML is enabled', () => {
		const nodes = parseMarkdown('<div id="section">Raw</div>\n\n# Section')
		const heading = nodes.find((node) => isNodeType(node, 'heading'))

		expect(heading ? createDocumentAnchors(nodes).headingIds.get(heading) : undefined).toBe('section')
		expect(heading ? createDocumentAnchors(nodes, undefined, true).headingIds.get(heading) : undefined).toBe(
			'section-1'
		)
	})

	it('allocates distinct heading, footnote, and repeated reference IDs', () => {
		const nodes = parseMarkdown('# Footnote x\n\nFirst[^x] and second[^x].\n\n[^x]: Shared note.')
		const anchors = createDocumentAnchors(nodes, 'doc')
		const ids = [
			...anchors.headingIds.values(),
			...anchors.footnoteIds.values(),
			...anchors.footnoteReferenceIds.values()
		]

		expect(new Set(ids).size).toBe(ids.length)
		expect(ids).toContain('doc-footnote-x')
		expect(ids).toContain('doc-footnote-x-1')
		expect(ids).toContain('doc-footnote-reference-x')
		expect(ids).toContain('doc-footnote-reference-x-2')
	})
})
