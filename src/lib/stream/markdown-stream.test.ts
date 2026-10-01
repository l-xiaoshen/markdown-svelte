import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import { parseMarkdown } from '../parser'
import MarkdownStream from './markdown-stream.svelte'
import { StreamingTextBuffer } from './streaming-text.svelte'

describe('MarkdownStream', () => {
	it('requires raw HTML rendering to be explicitly enabled', () => {
		const nodes = parseMarkdown('<div>block</div>\n\nbefore <strong>inline</strong> after')
		const escaped = render(MarkdownStream, { props: { nodes, animate: false } }).body
		const rendered = render(MarkdownStream, {
			props: { nodes, animate: false, allowRawHtml: true }
		}).body

		expect(escaped).toContain('&lt;div>block&lt;/div>')
		expect(escaped).toContain('&lt;strong>inline&lt;/strong>')
		expect(escaped).not.toContain('<div>block</div>')
		expect(rendered).toContain('<div>block</div>')
		expect(rendered).toContain('<strong>inline</strong>')
	})

	it('lets rapid text chunks finish independently before merging them in order', () => {
		const stream = new StreamingTextBuffer('Hello', true)
		stream.settle(stream.pendingChunks[0].id)
		stream.update('Hello I am', true)
		stream.update('Hello I am Steve', true)

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
		const stream = new StreamingTextBuffer('Hello', true)
		stream.update('Hello there', true)
		stream.update('Replacement', true)

		expect(stream.stableContent).toBe('Replacement')
		expect(stream.pendingChunks).toEqual([])
	})
})
