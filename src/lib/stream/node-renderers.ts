import type { NodeRendererMap } from '../render/registry'
import { nodeRenderers } from '../render/renderers'
import DefinitionItem from './nodes/DefinitionItem.svelte'
import Image from './nodes/Image.svelte'
import InlineCode from './nodes/InlineCode.svelte'
import MathBlock from './nodes/MathBlock.svelte'
import MathInline from './nodes/MathInline.svelte'
import TableCell from './nodes/TableCell.svelte'
import Text from './nodes/Text.svelte'

export const streamNodeRenderers = {
	...nodeRenderers,
	text: Text,
	inline_code: InlineCode,
	table_cell: TableCell,
	definition_item: DefinitionItem,
	image: Image,
	math_inline: MathInline,
	math_block: MathBlock
} satisfies NodeRendererMap
