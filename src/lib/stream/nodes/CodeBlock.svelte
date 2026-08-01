<script lang="ts">
	import type { CodeBlockNode as ParserCodeBlockNode } from 'stream-markdown-parser'
	import CodeBlock from '../../nodes/CodeBlock.svelte'
	import type { NodeProps } from '../../node-props'

	let { node }: NodeProps<ParserCodeBlockNode> = $props()
</script>

<CodeBlock {node} stream />
