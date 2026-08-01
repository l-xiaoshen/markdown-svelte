<script lang="ts">
	import { slide } from 'svelte/transition'
	import type { ListItemNode as ParserListItemNode, ParagraphNode, ParsedNode } from 'stream-markdown-parser'
	import NodeList from '../../node-list.svelte'
	import type { NodeProps } from '../../node-props'
	import { isNodeType } from '../../renderable-node'
	import { streamItemSlide } from '../motion'

	let { node }: NodeProps<ParserListItemNode> = $props()

	function isTaskParagraph(child: ParsedNode): child is ParagraphNode {
		return (
			isNodeType(child, 'paragraph') &&
			child.children.some((inline) => {
				return isNodeType(inline, 'checkbox') || isNodeType(inline, 'checkbox_input')
			})
		)
	}

	let taskParagraph = $derived(node.children.find(isTaskParagraph))
	let remainingChildren = $derived(
		taskParagraph ? node.children.filter((child) => child !== taskParagraph) : node.children
	)
</script>

<li
	class="markdown-svelte-list-item markdown-svelte-stream-list-item"
	class:markdown-svelte-list-item--task={taskParagraph !== undefined}
	in:slide|global={streamItemSlide}
>
	{#if taskParagraph}
		<div class="markdown-svelte-task-content"><NodeList nodes={taskParagraph.children} /></div>
	{/if}
	<NodeList nodes={remainingChildren} />
</li>

<style>
	:where(.markdown-svelte-list-item) {
		margin: 0.25em 0;
		padding-left: 0.2em;
	}

	:where(.markdown-svelte-list-item--task) {
		list-style: none;
	}

	:where(.markdown-svelte-task-content) {
		display: flex;
		align-items: flex-start;
		gap: 0.55em;
		margin-left: -1.45em;
	}
</style>
