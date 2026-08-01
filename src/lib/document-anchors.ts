import type { FootnoteAnchorNode, FootnoteNode, FootnoteReferenceNode, HeadingNode } from 'stream-markdown-parser'
import type { ParsedMarkdownNode } from './renderable-node'
import { isNodeType } from './renderable-node'

export interface DocumentAnchors {
	headingIds: ReadonlyMap<HeadingNode, string>
	footnoteIds: ReadonlyMap<FootnoteNode, string>
	footnoteReferenceIds: ReadonlyMap<FootnoteReferenceNode, string>
	footnoteTargets: ReadonlyMap<FootnoteReferenceNode, string>
	footnoteBacklinks: ReadonlyMap<FootnoteAnchorNode, readonly string[]>
	fragments: ReadonlyMap<string, string>
}

export function createDocumentAnchors(
	nodes: readonly ParsedMarkdownNode[],
	idPrefix?: string,
	allowRawHtml = false
): DocumentAnchors {
	const headings: HeadingNode[] = []
	const footnotes: FootnoteNode[] = []
	const references: FootnoteReferenceNode[] = []
	const backlinks: FootnoteAnchorNode[] = []
	const rawHtmlIds = new Set<string>()

	walkNodes(nodes, (node) => {
		if (isNodeType(node, 'heading')) {
			headings.push(node)
		} else if (isNodeType(node, 'footnote')) {
			footnotes.push(node)
		} else if (isNodeType(node, 'footnote_reference')) {
			references.push(node)
		} else if (isNodeType(node, 'footnote_anchor')) {
			backlinks.push(node)
		} else if (allowRawHtml && (isNodeType(node, 'html_block') || isNodeType(node, 'html_inline'))) {
			for (const id of extractHtmlIds(node.content)) {
				rawHtmlIds.add(id)
			}
		} else if (isNodeType(node, 'link')) {
			for (const [name, value] of node.attrs ?? []) {
				if (name.toLowerCase() === 'id' && value) {
					rawHtmlIds.add(value)
				}
			}
		}
	})

	const prefix = normalizeIdPrefix(idPrefix)
	const reserved = new Set(rawHtmlIds)
	const fragments = new Map<string, string>([...rawHtmlIds].map((id) => [id, id]))
	const headingIds = new Map<HeadingNode, string>()
	const footnoteIds = new Map<FootnoteNode, string>()
	const footnoteReferenceIds = new Map<FootnoteReferenceNode, string>()
	const footnoteTargets = new Map<FootnoteReferenceNode, string>()
	const footnoteBacklinks = new Map<FootnoteAnchorNode, readonly string[]>()
	const footnoteByLabel = new Map<string, FootnoteNode>()
	const referencesByLabel = new Map<string, FootnoteReferenceNode[]>()

	for (const heading of headings) {
		const source = headingAnchorBase(heading.children.map(headingText).join(''))
		const target = allocateId(source, prefix, reserved)
		headingIds.set(heading, target)
		addFragment(fragments, source, target)
		addFragment(fragments, removeIdPrefix(target, prefix), target)
	}

	for (const footnote of footnotes) {
		const source = `footnote-${headingAnchorBase(footnote.id)}`
		const target = allocateId(source, prefix, reserved)
		footnoteIds.set(footnote, target)
		if (!footnoteByLabel.has(footnote.id)) {
			footnoteByLabel.set(footnote.id, footnote)
		}
		addFragment(fragments, source, target)
	}

	for (const reference of references) {
		const entries = referencesByLabel.get(reference.id) ?? []
		entries.push(reference)
		referencesByLabel.set(reference.id, entries)

		const suffix = entries.length === 1 ? '' : `-${entries.length}`
		const source = `footnote-reference-${headingAnchorBase(reference.id)}${suffix}`
		const target = allocateId(source, prefix, reserved)
		footnoteReferenceIds.set(reference, target)
		const footnote = footnoteByLabel.get(reference.id)
		const footnoteTarget = footnote ? footnoteIds.get(footnote) : undefined
		if (footnoteTarget) {
			footnoteTargets.set(reference, footnoteTarget)
		}
		addFragment(fragments, source, target)
	}

	for (const backlink of backlinks) {
		const targets = (referencesByLabel.get(backlink.id) ?? [])
			.map((reference) => footnoteReferenceIds.get(reference))
			.filter((target): target is string => target !== undefined)
		footnoteBacklinks.set(backlink, targets)
	}

	return {
		headingIds,
		footnoteIds,
		footnoteReferenceIds,
		footnoteTargets,
		footnoteBacklinks,
		fragments
	}
}

export function headingAnchorBase(text: string): string {
	return (
		text
			.trim()
			.toLocaleLowerCase('en-US')
			.replace(/\s+/g, '-')
			.replace(/[^\p{L}\p{M}\p{N}_-]/gu, '') || 'section'
	)
}

export function headingText(node: ParsedMarkdownNode): string {
	if (isNodeType(node, 'text')) {
		return node.content
	}
	if (isNodeType(node, 'inline_code')) {
		return node.code
	}
	if (isNodeType(node, 'image')) {
		return node.alt
	}
	if (isNodeType(node, 'emoji')) {
		return node.markup
	}
	if (isNodeType(node, 'math_inline') || isNodeType(node, 'math_block')) {
		return node.content
	}
	if (isNodeType(node, 'reference')) {
		return node.raw || node.id
	}
	if (isNodeType(node, 'html_inline')) {
		return node.children.map(headingText).join('')
	}
	return childNodes(node).map(headingText).join('')
}

function normalizeIdPrefix(prefix?: string): string {
	if (!prefix?.trim()) {
		return ''
	}
	return headingAnchorBase(prefix).replace(/^-+|-+$/g, '') || 'markdown'
}

function allocateId(base: string, prefix: string, reserved: Set<string>): string {
	let suffix = 0
	let candidate = scopedId(prefix, base)
	while (reserved.has(candidate)) {
		suffix += 1
		candidate = scopedId(prefix, `${base}-${suffix}`)
	}
	reserved.add(candidate)
	return candidate
}

function scopedId(prefix: string, id: string): string {
	return prefix ? `${prefix}-${id}` : id
}

function removeIdPrefix(id: string, prefix: string): string {
	const marker = prefix ? `${prefix}-` : ''
	return marker && id.startsWith(marker) ? id.slice(marker.length) : id
}

function addFragment(fragments: Map<string, string>, source: string, target: string): void {
	if (!fragments.has(source)) {
		fragments.set(source, target)
	}
	fragments.set(target, target)
}

function extractHtmlIds(content: string): string[] {
	const ids: string[] = []
	const attributes = content.matchAll(/\bid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi)
	for (const match of attributes) {
		const id = match[1] || match[2] || match[3]
		if (id) {
			ids.push(id)
		}
	}
	return ids
}

function walkNodes(nodes: readonly ParsedMarkdownNode[], visit: (node: ParsedMarkdownNode) => void): void {
	const seen = new WeakSet<object>()

	function walk(node: ParsedMarkdownNode): void {
		if (seen.has(node)) {
			return
		}
		seen.add(node)
		visit(node)
		if (isNodeType(node, 'html_block') || isNodeType(node, 'html_inline')) {
			return
		}
		for (const child of childNodes(node)) {
			walk(child)
		}
	}

	for (const node of nodes) {
		walk(node)
	}
}

function childNodes(node: ParsedMarkdownNode): readonly ParsedMarkdownNode[] {
	if (
		isNodeType(node, 'heading') ||
		isNodeType(node, 'paragraph') ||
		isNodeType(node, 'inline') ||
		isNodeType(node, 'list_item') ||
		isNodeType(node, 'blockquote') ||
		isNodeType(node, 'strong') ||
		isNodeType(node, 'emphasis') ||
		isNodeType(node, 'strikethrough') ||
		isNodeType(node, 'highlight') ||
		isNodeType(node, 'insert') ||
		isNodeType(node, 'subscript') ||
		isNodeType(node, 'superscript') ||
		isNodeType(node, 'link') ||
		isNodeType(node, 'footnote') ||
		isNodeType(node, 'admonition') ||
		isNodeType(node, 'vmr_container')
	) {
		return node.children
	}
	if (isNodeType(node, 'list')) {
		return node.items
	}
	if (isNodeType(node, 'table')) {
		return [node.header, ...node.rows]
	}
	if (isNodeType(node, 'table_row')) {
		return node.cells
	}
	if (isNodeType(node, 'table_cell')) {
		return node.children
	}
	if (isNodeType(node, 'definition_list')) {
		return node.items
	}
	if (isNodeType(node, 'definition_item')) {
		return [...node.term, ...node.definition]
	}
	return []
}
