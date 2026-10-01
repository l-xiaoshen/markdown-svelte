import { untrack } from 'svelte'

interface StreamingTextOptions {
	getContent: () => string
	getAnimate: () => boolean
}

export interface StreamingTextChunk {
	id: number
	content: string
	settled: boolean
}

export class StreamingTextBuffer {
	stableContent: string
	pendingChunks: StreamingTextChunk[]

	#previousContent: string
	#previousAnimate: boolean
	#nextChunkId = 0

	constructor(content: string, animate: boolean) {
		this.#previousContent = content
		this.#previousAnimate = animate
		this.stableContent = animate ? '' : content
		this.pendingChunks = animate && content ? [this.#createChunk(content)] : []
	}

	update(content: string, animate: boolean): boolean {
		if (content === this.#previousContent && animate === this.#previousAnimate) return false

		if (animate && content.length > this.#previousContent.length && content.startsWith(this.#previousContent)) {
			this.pendingChunks = [...this.pendingChunks, this.#createChunk(content.slice(this.#previousContent.length))]
		} else {
			this.stableContent = content
			this.pendingChunks = []
		}

		this.#previousContent = content
		this.#previousAnimate = animate
		return true
	}

	settle(id: number): boolean {
		const chunkIndex = this.pendingChunks.findIndex((chunk) => chunk.id === id)
		if (chunkIndex === -1 || this.pendingChunks[chunkIndex].settled) return false

		const chunks = this.pendingChunks.map((chunk, index) =>
			index === chunkIndex ? { ...chunk, settled: true } : chunk
		)
		let settledCount = 0
		while (chunks[settledCount]?.settled) settledCount += 1

		if (settledCount > 0) {
			this.stableContent += chunks
				.slice(0, settledCount)
				.map((chunk) => chunk.content)
				.join('')
			this.pendingChunks = chunks.slice(settledCount)
		} else {
			this.pendingChunks = chunks
		}

		return true
	}

	#createChunk(content: string): StreamingTextChunk {
		return {
			id: (this.#nextChunkId += 1),
			content,
			settled: false
		}
	}
}

export class StreamingText {
	stableContent = $state('')
	pendingChunks = $state<StreamingTextChunk[]>([])

	#buffer: StreamingTextBuffer

	constructor(private readonly options: StreamingTextOptions) {
		const content = untrack(this.options.getContent)
		const animate = untrack(this.options.getAnimate)

		this.#buffer = new StreamingTextBuffer(content, animate)
		this.#sync()

		$effect.pre(() => {
			const nextContent = this.options.getContent()
			const nextAnimate = this.options.getAnimate()

			untrack(() => {
				if (this.#buffer.update(nextContent, nextAnimate)) this.#sync()
			})
		})
	}

	settle(id: number): void {
		if (this.#buffer.settle(id)) this.#sync()
	}

	#sync(): void {
		this.stableContent = this.#buffer.stableContent
		this.pendingChunks = this.#buffer.pendingChunks
	}
}
