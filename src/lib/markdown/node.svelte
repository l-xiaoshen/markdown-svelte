<script lang="ts">
	import Admonition from './nodes/admonition.svelte'
	import Blockquote from './nodes/blockquote.svelte'
	import Checkbox from './nodes/checkbox.svelte'
	import CheckboxInput from './nodes/checkbox-input.svelte'
	import CodeBlock from './nodes/code-block.svelte'
	import DefinitionItem from './nodes/definition-item.svelte'
	import DefinitionList from './nodes/definition-list.svelte'
	import Emoji from './nodes/emoji.svelte'
	import Emphasis from './nodes/emphasis.svelte'
	import Fallback from './nodes/fallback.svelte'
	import Footnote from './nodes/footnote.svelte'
	import FootnoteAnchor from './nodes/footnote-anchor.svelte'
	import FootnoteReference from './nodes/footnote-reference.svelte'
	import Hardbreak from './nodes/hardbreak.svelte'
	import Heading from './nodes/heading.svelte'
	import Highlight from './nodes/highlight.svelte'
	import HtmlBlock from './nodes/html-block.svelte'
	import HtmlInline from './nodes/html-inline.svelte'
	import Image from './nodes/image.svelte'
	import Inline from './nodes/inline.svelte'
	import InlineCode from './nodes/inline-code.svelte'
	import Insert from './nodes/insert.svelte'
	import Link from './nodes/link.svelte'
	import List from './nodes/list.svelte'
	import ListItem from './nodes/list-item.svelte'
	import MathBlock from './nodes/math-block.svelte'
	import MathInline from './nodes/math-inline.svelte'
	import Paragraph from './nodes/paragraph.svelte'
	import Reference from './nodes/reference.svelte'
	import Strikethrough from './nodes/strikethrough.svelte'
	import Strong from './nodes/strong.svelte'
	import Subscript from './nodes/subscript.svelte'
	import Superscript from './nodes/superscript.svelte'
	import Table from './nodes/table.svelte'
	import TableCell from './nodes/table-cell.svelte'
	import TableRow from './nodes/table-row.svelte'
	import Text from './nodes/text.svelte'
	import ThematicBreak from './nodes/thematic-break.svelte'
	import VmrContainer from './nodes/vmr-container.svelte'
	import type { NodeProps } from './node-props'
	import { isNodeType, type ParsedMarkdownNode } from './renderable-node'

	let { node, insideLink = false }: NodeProps<ParsedMarkdownNode> = $props()
</script>

{#if isNodeType(node, 'text')}
	<Text {node} />
{:else if isNodeType(node, 'heading')}
	<Heading {node} {insideLink} />
{:else if isNodeType(node, 'paragraph')}
	<Paragraph {node} />
{:else if isNodeType(node, 'inline')}
	<Inline {node} {insideLink} />
{:else if isNodeType(node, 'list')}
	<List {node} />
{:else if isNodeType(node, 'list_item')}
	<ListItem {node} />
{:else if isNodeType(node, 'code_block')}
	<CodeBlock {node} />
{:else if isNodeType(node, 'inline_code')}
	<InlineCode {node} />
{:else if isNodeType(node, 'link')}
	<Link {node} {insideLink} />
{:else if isNodeType(node, 'image')}
	<Image {node} />
{:else if isNodeType(node, 'thematic_break')}
	<ThematicBreak {node} />
{:else if isNodeType(node, 'blockquote')}
	<Blockquote {node} />
{:else if isNodeType(node, 'table')}
	<Table {node} />
{:else if isNodeType(node, 'table_row')}
	<TableRow {node} />
{:else if isNodeType(node, 'table_cell')}
	<TableCell {node} />
{:else if isNodeType(node, 'strong')}
	<Strong {node} {insideLink} />
{:else if isNodeType(node, 'emphasis')}
	<Emphasis {node} {insideLink} />
{:else if isNodeType(node, 'strikethrough')}
	<Strikethrough {node} {insideLink} />
{:else if isNodeType(node, 'highlight')}
	<Highlight {node} {insideLink} />
{:else if isNodeType(node, 'insert')}
	<Insert {node} {insideLink} />
{:else if isNodeType(node, 'subscript')}
	<Subscript {node} {insideLink} />
{:else if isNodeType(node, 'superscript')}
	<Superscript {node} {insideLink} />
{:else if isNodeType(node, 'checkbox')}
	<Checkbox {node} />
{:else if isNodeType(node, 'checkbox_input')}
	<CheckboxInput {node} />
{:else if isNodeType(node, 'emoji')}
	<Emoji {node} />
{:else if isNodeType(node, 'definition_list')}
	<DefinitionList {node} />
{:else if isNodeType(node, 'definition_item')}
	<DefinitionItem {node} />
{:else if isNodeType(node, 'footnote')}
	<Footnote {node} />
{:else if isNodeType(node, 'footnote_reference')}
	<FootnoteReference {node} {insideLink} />
{:else if isNodeType(node, 'footnote_anchor')}
	<FootnoteAnchor {node} />
{:else if isNodeType(node, 'admonition')}
	<Admonition {node} />
{:else if isNodeType(node, 'vmr_container')}
	<VmrContainer {node} />
{:else if isNodeType(node, 'hardbreak')}
	<Hardbreak {node} />
{:else if isNodeType(node, 'math_inline')}
	<MathInline {node} />
{:else if isNodeType(node, 'math_block')}
	<MathBlock {node} />
{:else if isNodeType(node, 'reference')}
	<Reference {node} />
{:else if isNodeType(node, 'html_block')}
	<HtmlBlock {node} />
{:else if isNodeType(node, 'html_inline')}
	<HtmlInline {node} {insideLink} />
{:else}
	<Fallback {node} />
{/if}
