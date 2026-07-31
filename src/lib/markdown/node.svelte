<script lang="ts">
	import Admonition from './nodes/Admonition.svelte'
	import Blockquote from './nodes/Blockquote.svelte'
	import Checkbox from './nodes/Checkbox.svelte'
	import CheckboxInput from './nodes/CheckboxInput.svelte'
	import CodeBlock from './nodes/CodeBlock.svelte'
	import DefinitionItem from './nodes/DefinitionItem.svelte'
	import DefinitionList from './nodes/DefinitionList.svelte'
	import Emoji from './nodes/Emoji.svelte'
	import Emphasis from './nodes/Emphasis.svelte'
	import Fallback from './nodes/Fallback.svelte'
	import Footnote from './nodes/Footnote.svelte'
	import FootnoteAnchor from './nodes/FootnoteAnchor.svelte'
	import FootnoteReference from './nodes/FootnoteReference.svelte'
	import Hardbreak from './nodes/Hardbreak.svelte'
	import Heading from './nodes/Heading.svelte'
	import Highlight from './nodes/Highlight.svelte'
	import HtmlBlock from './nodes/HtmlBlock.svelte'
	import HtmlInline from './nodes/HtmlInline.svelte'
	import Image from './nodes/Image.svelte'
	import Inline from './nodes/Inline.svelte'
	import InlineCode from './nodes/InlineCode.svelte'
	import Insert from './nodes/Insert.svelte'
	import Link from './nodes/Link.svelte'
	import List from './nodes/List.svelte'
	import ListItem from './nodes/ListItem.svelte'
	import MathBlock from './nodes/MathBlock.svelte'
	import MathInline from './nodes/MathInline.svelte'
	import Paragraph from './nodes/Paragraph.svelte'
	import Reference from './nodes/Reference.svelte'
	import Strikethrough from './nodes/Strikethrough.svelte'
	import Strong from './nodes/Strong.svelte'
	import Subscript from './nodes/Subscript.svelte'
	import Superscript from './nodes/Superscript.svelte'
	import Table from './nodes/Table.svelte'
	import TableCell from './nodes/TableCell.svelte'
	import TableRow from './nodes/TableRow.svelte'
	import Text from './nodes/Text.svelte'
	import ThematicBreak from './nodes/ThematicBreak.svelte'
	import VmrContainer from './nodes/VmrContainer.svelte'
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
