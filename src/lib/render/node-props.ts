import type { BaseNode } from 'stream-markdown-parser'

export interface NodeProps<TNode extends BaseNode> {
	node: TNode
	insideLink?: boolean
}
