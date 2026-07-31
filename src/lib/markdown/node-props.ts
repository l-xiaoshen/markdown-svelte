import type { BaseNode } from 'stream-markdown-parser'

export interface NodeProps<TNode extends BaseNode = BaseNode> {
	node: TNode
	insideLink?: boolean
}
