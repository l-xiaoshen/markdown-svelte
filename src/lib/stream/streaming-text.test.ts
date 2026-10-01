import { describe, expect, it } from 'vitest'
import { StreamingText } from './streaming-text.svelte'

describe('StreamingText', () => {
	it('lets rapid text chunks finish independently before merging them in order', () => {
		const stream = new StreamingText('Hello')
		stream.settle(stream.pendingChunks[0].id)
		stream.update('Hello I am')
		stream.update('Hello I am Steve')

		const [intro, name] = stream.pendingChunks
		expect(stream.stableContent).toBe('Hello')
		expect(stream.pendingChunks.map((chunk) => chunk.content)).toEqual([' I am', ' Steve'])

		stream.settle(name.id)
		expect(stream.stableContent).toBe('Hello')
		expect(stream.pendingChunks).toEqual([intro, { ...name, settled: true }])

		stream.settle(intro.id)
		expect(stream.stableContent).toBe('Hello I am Steve')
		expect(stream.pendingChunks).toEqual([])
	})

	it('flushes pending text animations when content is replaced', () => {
		const stream = new StreamingText('Hello')
		stream.update('Hello there')
		stream.update('Replacement')

		expect(stream.stableContent).toBe('Replacement')
		expect(stream.pendingChunks).toEqual([])
	})

	it('ignores stale animation completions after replacing content', () => {
		const stream = new StreamingText('Hello')
		const staleId = stream.pendingChunks[0].id
		stream.update('Replacement')
		stream.update('Replacement text')
		stream.settle(staleId)

		expect(stream.stableContent).toBe('Replacement')
		expect(stream.pendingChunks.map((chunk) => chunk.content)).toEqual([' text'])
	})

	it('starts fresh after clearing content without duplicating unchanged chunks', () => {
		const stream = new StreamingText('Hello')
		stream.update('')
		stream.update('New')
		stream.update('New')

		expect(stream.stableContent).toBe('')
		expect(stream.pendingChunks.map((chunk) => chunk.content)).toEqual(['New'])
	})
})
