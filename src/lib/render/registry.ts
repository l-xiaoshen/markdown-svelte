import type { Component } from 'svelte'
import Fallback from './nodes/Fallback.svelte'
import type { NodeProps } from './node-props'
import type { KnownMarkdownNodeType, MarkdownNodeOfType, ParsedMarkdownNode } from '../renderable-node'

type MarkdownNodeRenderer = Component<NodeProps<ParsedMarkdownNode>>

export type NodeRendererMap = {
	[TType in KnownMarkdownNodeType]: Component<NodeProps<MarkdownNodeOfType<TType>>>
}

export function resolveNodeRenderer(renderers: NodeRendererMap, type: string): MarkdownNodeRenderer {
	if (!Object.hasOwn(renderers, type)) return Fallback
	// The registry checks each component's node type; dispatch preserves that pairing.
	return renderers[type as KnownMarkdownNodeType] as MarkdownNodeRenderer
}
