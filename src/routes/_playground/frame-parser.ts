import type { ParseRequest, ParseResponse } from './markdown.worker'

interface FrameParserOptions {
	onUpdate: (response: ParseResponse) => void
	onError: (message: string) => void
}

export function createFrameParser({ onUpdate, onError }: FrameParserOptions) {
	const worker = new Worker(new URL('./markdown.worker.ts', import.meta.url), { type: 'module' })
	let version = 0
	let frame = 0
	let busy = false
	let stopped = false
	let sentLength = 0
	let needsReset = true
	let pending: { source: string; final: boolean } | undefined
	let result: ParseResponse | undefined

	function schedule(): void {
		if (!frame) frame = requestAnimationFrame(flush)
	}

	function flush(): void {
		frame = 0
		if (result?.version === version) onUpdate(result)
		result = undefined

		// Keep one job in flight and one latest snapshot, so a slow worker cannot build a backlog.
		if (busy || !pending) return
		const { source, final } = pending
		pending = undefined
		worker.postMessage({
			version,
			value: source.slice(sentLength),
			reset: needsReset,
			final
		} satisfies ParseRequest)
		sentLength = source.length
		needsReset = false
		busy = true
	}

	worker.onmessage = (event: MessageEvent<ParseResponse>) => {
		busy = false
		result = event.data
		schedule()
	}

	function fail(): void {
		dispose()
		onError('Markdown parsing failed. Retry the preview.')
	}

	worker.onerror = fail
	worker.onmessageerror = fail

	function update(source: string, final: boolean): void {
		if (stopped) return
		pending = { source, final }
		schedule()
	}

	function dispose(): void {
		stopped = true
		cancelAnimationFrame(frame)
		worker.onmessage = worker.onerror = worker.onmessageerror = null
		worker.terminate()
		pending = undefined
		result = undefined
	}

	return {
		update,
		reset(source = '', final = false): void {
			version += 1
			sentLength = 0
			needsReset = true
			result = undefined
			update(source, final)
		},
		dispose
	}
}
