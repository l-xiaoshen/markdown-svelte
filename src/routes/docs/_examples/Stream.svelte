<script lang="ts">
	import { onMount } from 'svelte'
	import type { ParsedMarkdownNode } from 'markdown-svelte'
	import { MarkdownStream } from 'markdown-svelte/stream'

	let nodes = $state.raw<ParsedMarkdownNode[]>([])

	onMount(() => {
		const worker = new Worker(new URL('./markdown.worker.ts', import.meta.url), { type: 'module' })
		let latest: ParsedMarkdownNode[] = []
		let frame: number | null = null

		worker.onmessage = ({ data }: MessageEvent<ParsedMarkdownNode[]>) => {
			latest = data
			if (frame !== null) return
			frame = requestAnimationFrame(() => {
				nodes = latest
				frame = null
			})
		}

		// Replace these sample messages with chunks from your stream.
		worker.postMessage({ chunk: '# Hello\n\n' })
		worker.postMessage({ chunk: 'From a **worker**.', final: true })

		return () => {
			worker.terminate()
			if (frame !== null) cancelAnimationFrame(frame)
		}
	})
</script>

<MarkdownStream {nodes} />
