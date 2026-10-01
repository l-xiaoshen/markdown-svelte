<script lang="ts">
	import { untrack } from 'svelte'
	import { StreamingText } from '../streaming-text.svelte'
	import Delta from './Delta.svelte'

	let { content }: { content: string } = $props()
	const stream = new StreamingText(untrack(() => content))

	$effect.pre(() => {
		const nextContent = content
		untrack(() => stream.update(nextContent))
	})
</script>

{stream.stableContent}{#each stream.pendingChunks as chunk (chunk.id)}<Delta
		content={chunk.content}
		onsettled={() => stream.settle(chunk.id)}
	/>{/each}
