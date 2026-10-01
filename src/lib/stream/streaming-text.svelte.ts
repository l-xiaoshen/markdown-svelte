interface StreamingTextChunk {
	id: number
	content: string
	settled: boolean
}

export class StreamingText {
	stableContent = $state('')
	pendingChunks = $state.raw<StreamingTextChunk[]>([])

	#previousContent: string
	#nextChunkId = 0

	constructor(content: string) {
		this.#previousContent = content
		this.pendingChunks = content ? [this.#createChunk(content)] : []
	}

	update(content: string): void {
		if (content === this.#previousContent) return

		if (content.length > this.#previousContent.length && content.startsWith(this.#previousContent)) {
			this.pendingChunks = [...this.pendingChunks, this.#createChunk(content.slice(this.#previousContent.length))]
		} else {
			this.stableContent = content
			this.pendingChunks = []
		}

		this.#previousContent = content
	}

	settle(id: number): void {
		const chunkIndex = this.pendingChunks.findIndex((chunk) => chunk.id === id)
		if (chunkIndex === -1 || this.pendingChunks[chunkIndex].settled) return

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
	}

	#createChunk(content: string): StreamingTextChunk {
		return {
			id: (this.#nextChunkId += 1),
			content,
			settled: false
		}
	}
}
