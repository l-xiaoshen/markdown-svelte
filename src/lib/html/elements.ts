import type { ParsedMarkdownNode } from '../renderable-node'
import { isNodeType } from '../renderable-node'

const BLOCK_HTML_TAGS = new Set([
	'address',
	'article',
	'aside',
	'blockquote',
	'caption',
	'center',
	'colgroup',
	'dd',
	'details',
	'dialog',
	'div',
	'dl',
	'dt',
	'fieldset',
	'figcaption',
	'figure',
	'footer',
	'form',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'header',
	'hgroup',
	'hr',
	'iframe',
	'li',
	'main',
	'menu',
	'nav',
	'ol',
	'p',
	'pre',
	'script',
	'search',
	'section',
	'style',
	'summary',
	'table',
	'tbody',
	'td',
	'tfoot',
	'th',
	'thead',
	'tr',
	'ul'
])

const BLOCK_NODE_TYPES: ReadonlySet<string> = new Set([
	'admonition',
	'blockquote',
	'code_block',
	'definition_list',
	'footnote',
	'heading',
	'html_block',
	'list',
	'list_item',
	'math_block',
	'paragraph',
	'table',
	'thematic_break',
	'vmr_container'
])

const CONTAINER_REQUIRED_TAGS = new Set([
	'caption',
	'colgroup',
	'dd',
	'dt',
	'li',
	'tbody',
	'td',
	'tfoot',
	'th',
	'thead',
	'tr'
])

export function isBlockContent(node: ParsedMarkdownNode): boolean {
	return BLOCK_NODE_TYPES.has(node.type) || (isNodeType(node, 'html_inline') && isBlockHtmlTag(node.tag))
}

export function isBlockHtmlTag(tag?: string): boolean {
	return tag !== undefined && BLOCK_HTML_TAGS.has(tag.toLowerCase())
}

export function canRenderHtmlTagAtRoot(tag?: string): boolean {
	return tag === undefined || !CONTAINER_REQUIRED_TAGS.has(tag.toLowerCase())
}

export function canRenderHtmlSourceAtRoot(source: string): boolean {
	const tag = /^<\s*([a-z][\w-]*)/i.exec(source)?.[1]
	return canRenderHtmlTagAtRoot(tag)
}
