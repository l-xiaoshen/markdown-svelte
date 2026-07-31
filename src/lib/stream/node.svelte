<script lang="ts">
	import Node from '../markdown/node.svelte'
	import type { NodeProps } from '../markdown/node-props'
	import { useRenderContext } from '../markdown/render-context'
	import { isNodeType, type ParsedMarkdownNode } from '../markdown/renderable-node'
	import InlineCode from './nodes/InlineCode.svelte'
	import Text from './nodes/Text.svelte'

	let { node, insideLink = false }: NodeProps<ParsedMarkdownNode> = $props()
	const context = useRenderContext()
</script>

{#if context.animate === true && isNodeType(node, 'text')}
	<Text {node} />
{:else if context.animate === true && isNodeType(node, 'inline_code')}
	<InlineCode {node} />
{:else}
	<Node {node} {insideLink} />
{/if}
