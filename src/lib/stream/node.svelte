<script lang="ts">
	import Admonition from '../nodes/Admonition.svelte'
	import Blockquote from '../nodes/Blockquote.svelte'
	import Node from '../node.svelte'
	import ThematicBreak from '../nodes/ThematicBreak.svelte'
	import VmrContainer from '../nodes/VmrContainer.svelte'
	import type { NodeProps } from '../node-props'
	import { useRenderContext } from '../render-context'
	import { isNodeType, type ParsedMarkdownNode } from '../renderable-node'
	import CodeBlock from './nodes/CodeBlock.svelte'
	import DefinitionItem from './nodes/DefinitionItem.svelte'
	import Footnote from './nodes/Footnote.svelte'
	import Image from './nodes/Image.svelte'
	import InlineCode from './nodes/InlineCode.svelte'
	import ListItem from './nodes/ListItem.svelte'
	import MathBlock from './nodes/MathBlock.svelte'
	import MathInline from './nodes/MathInline.svelte'
	import TableCell from './nodes/TableCell.svelte'
	import Text from './nodes/Text.svelte'

	let { node, insideLink = false }: NodeProps<ParsedMarkdownNode> = $props()
	const context = useRenderContext()
</script>

{#if context.animate === true && isNodeType(node, 'text')}
	<Text {node} />
{:else if context.animate === true && isNodeType(node, 'inline_code')}
	<InlineCode {node} />
{:else if context.animate === true && isNodeType(node, 'code_block')}
	<CodeBlock {node} />
{:else if context.animate === true && isNodeType(node, 'table_cell')}
	<TableCell {node} />
{:else if context.animate === true && isNodeType(node, 'list_item')}
	<ListItem {node} />
{:else if context.animate === true && isNodeType(node, 'definition_item')}
	<DefinitionItem {node} />
{:else if context.animate === true && isNodeType(node, 'footnote')}
	<Footnote {node} />
{:else if context.animate === true && isNodeType(node, 'blockquote')}
	<Blockquote {node} stream />
{:else if context.animate === true && isNodeType(node, 'admonition')}
	<Admonition {node} stream />
{:else if context.animate === true && isNodeType(node, 'vmr_container')}
	<VmrContainer {node} stream />
{:else if context.animate === true && isNodeType(node, 'thematic_break')}
	<ThematicBreak {node} stream />
{:else if context.animate === true && isNodeType(node, 'image')}
	<Image {node} />
{:else if context.animate === true && isNodeType(node, 'math_inline')}
	<MathInline {node} />
{:else if context.animate === true && isNodeType(node, 'math_block')}
	<MathBlock {node} />
{:else}
	<Node {node} {insideLink} />
{/if}
