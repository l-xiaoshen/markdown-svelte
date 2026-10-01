import Admonition from './nodes/Admonition.svelte'
import Blockquote from './nodes/Blockquote.svelte'
import Checkbox from './nodes/Checkbox.svelte'
import CodeBlock from './nodes/CodeBlock.svelte'
import DefinitionItem from './nodes/DefinitionItem.svelte'
import DefinitionList from './nodes/DefinitionList.svelte'
import Emoji from './nodes/Emoji.svelte'
import Emphasis from './nodes/Emphasis.svelte'
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
import type { NodeRendererMap } from './registry'

export const nodeRenderers = {
	text: Text,
	heading: Heading,
	paragraph: Paragraph,
	inline: Inline,
	list: List,
	list_item: ListItem,
	code_block: CodeBlock,
	inline_code: InlineCode,
	link: Link,
	image: Image,
	thematic_break: ThematicBreak,
	blockquote: Blockquote,
	table: Table,
	table_row: TableRow,
	table_cell: TableCell,
	strong: Strong,
	emphasis: Emphasis,
	strikethrough: Strikethrough,
	highlight: Highlight,
	insert: Insert,
	subscript: Subscript,
	superscript: Superscript,
	checkbox: Checkbox,
	checkbox_input: Checkbox,
	emoji: Emoji,
	definition_list: DefinitionList,
	definition_item: DefinitionItem,
	footnote: Footnote,
	footnote_reference: FootnoteReference,
	footnote_anchor: FootnoteAnchor,
	admonition: Admonition,
	vmr_container: VmrContainer,
	hardbreak: Hardbreak,
	math_inline: MathInline,
	math_block: MathBlock,
	reference: Reference,
	html_block: HtmlBlock,
	html_inline: HtmlInline
} satisfies NodeRendererMap
