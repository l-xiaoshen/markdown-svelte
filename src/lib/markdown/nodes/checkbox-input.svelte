<script lang="ts">
	import type { CheckboxInputNode as ParserCheckboxInputNode } from 'stream-markdown-parser'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserCheckboxInputNode> = $props()
</script>

<input
	class="markdown-svelte-checkbox"
	type="checkbox"
	checked={node.checked}
	disabled
	aria-label={node.checked ? 'Completed task' : 'Incomplete task'}
/>

<style>
	:where(.markdown-svelte-checkbox) {
		width: 1rem;
		height: 1rem;
		margin: 0.36em 0 0;
		accent-color: var(--_markdown-color-accent);
	}
</style>
