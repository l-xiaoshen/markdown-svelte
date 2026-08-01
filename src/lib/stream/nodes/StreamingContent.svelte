<script lang="ts">
	import { useRenderContext } from '../../render-context'
	import { StreamingText } from '../streaming-text.svelte'
	import Delta from './Delta.svelte'

	let { content }: { content: string } = $props()
	const context = useRenderContext()
	const stream = new StreamingText({
		getContent: () => content,
		getAnimate: () => context.animate === true
	})
</script>

{stream.stableContent}{#each stream.pendingChunks as chunk (chunk.id)}<Delta
		content={chunk.content}
		onsettled={() => stream.settle(chunk.id)}
	/>{/each}
