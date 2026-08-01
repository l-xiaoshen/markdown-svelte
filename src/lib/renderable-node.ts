import type { BaseNode, FootnoteAnchorNode, InlineNode, ParsedNode } from 'stream-markdown-parser'

export type ParsedMarkdownNode = ParsedNode | InlineNode | FootnoteAnchorNode

type DiscriminatedParsedNode<TNode extends BaseNode> = TNode extends BaseNode
	? string extends TNode['type']
		? never
		: TNode
	: never

type ConcreteParsedNode = DiscriminatedParsedNode<ParsedNode>

export type KnownMarkdownNode = ConcreteParsedNode | InlineNode | FootnoteAnchorNode
export type KnownMarkdownNodeType = KnownMarkdownNode['type']
export type MarkdownNodeOfType<TType extends KnownMarkdownNodeType> = Extract<KnownMarkdownNode, { type: TType }>

export function isNodeType<TType extends KnownMarkdownNodeType>(
	node: BaseNode,
	type: TType
): node is MarkdownNodeOfType<TType> {
	return node.type === type
}
