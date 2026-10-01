<script lang="ts">
	import type { DefinitionItemNode as ParserDefinitionItemNode } from 'stream-markdown-parser'
	import NodeList from '../node-list.svelte'
	import type { NodeProps } from '../node-props'

	let { node }: NodeProps<ParserDefinitionItemNode> = $props()
</script>

<dt class="markdown-svelte-definition-term"><NodeList inline nodes={node.term} /></dt>
<dd class="markdown-svelte-definition-description"><NodeList nodes={node.definition} /></dd>

<style>
	:where(.markdown-svelte-definition-term) {
		font-weight: 700;
	}

	:where(.markdown-svelte-definition-description) {
		margin: 0.2em 0 0.8em 1.2em;
		color: var(--_markdown-color-muted);
	}
</style>
