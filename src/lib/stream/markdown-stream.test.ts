import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import type { DefinitionListNode } from 'stream-markdown-parser'
import { parseMarkdown } from '../parser'
import MarkdownStream from './markdown-stream.svelte'
import { streamItemSlide } from './motion'
import { resolveStreamingText, StreamingTextBuffer } from './streaming-text.svelte'

describe('MarkdownStream', () => {
	it('renders parsed nodes through the stream entrypoint', () => {
		const nodes = parseMarkdown('Hello `stream`')
		const animated = render(MarkdownStream, { props: { nodes } }).body
		const settled = render(MarkdownStream, { props: { nodes, animate: false } }).body

		expect(animated).toContain('data-markdown-svelte-stream=""')
		expect(animated).toContain('markdown-svelte-stream-delta')
		expect(settled).toContain('Hello ')
		expect(settled).not.toContain('markdown-svelte-stream-delta')
	})

	it('only separates append-only text updates', () => {
		expect(resolveStreamingText('streaming', 'stream', true)).toEqual({ type: 'append', content: 'ing' })
		expect(resolveStreamingText('replacement', 'stream', true)).toEqual({
			type: 'replace',
			content: 'replacement'
		})
	})

	it('uses a short item transition for streaming lists', () => {
		expect(streamItemSlide.duration).toBe(120)
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

	it('opts code blocks and table rows into native size transitions', () => {
		const nodes = parseMarkdown(
			'```ts\nconst first = 1\nconst second = 2\n```\n\n| Name | Value |\n| --- | --- |\n| one | two |'
		)
		const animated = render(MarkdownStream, { props: { nodes } }).body
		const settled = render(MarkdownStream, { props: { nodes, animate: false } }).body

		expect(animated).toContain('markdown-svelte-stream-code-size')
		expect(animated).toContain('markdown-svelte-stream-code-language')
		expect(animated).toContain('height: calc(2rem + 2lh)')
		expect(animated).toContain('markdown-svelte-stream-table-cell')
		expect(settled).not.toContain('markdown-svelte-stream-code-size')
		expect(settled).not.toContain('markdown-svelte-stream-code-language')
		expect(settled).not.toContain('markdown-svelte-stream-table-cell')
	})

	it('adds native motion boundaries to streamed structural nodes', () => {
		const definitionList = {
			type: 'definition_list',
			raw: '',
			items: [
				{
					type: 'definition_item',
					raw: '',
					term: [{ type: 'text', content: 'Term', raw: 'Term' }],
					definition: [
						{
							type: 'paragraph',
							raw: 'Definition',
							children: [{ type: 'text', content: 'Definition', raw: 'Definition' }]
						}
					]
				}
			]
		} satisfies DefinitionListNode
		const nodes = [
			...parseMarkdown(
				'- first\n- second\n\n> quote\n\n::: tip\nUseful\n:::\n\n---\n\nMath $x+y$.\n\n$$\na + b\n$$\n\nA note[^n].\n\n[^n]: Footnote\n\n![mark](/favicon.svg)'
			),
			definitionList
		]
		const animated = render(MarkdownStream, { props: { nodes } }).body
		const settled = render(MarkdownStream, { props: { nodes, animate: false } }).body
		const motionClasses = [
			'markdown-svelte-stream-list-item',
			'markdown-svelte-stream-definition-item',
			'markdown-svelte-stream-footnote',
			'markdown-svelte-stream-block-enter',
			'markdown-svelte-stream-rule',
			'markdown-svelte-stream-image',
			'markdown-svelte-stream-math-block',
			'markdown-svelte-stream-math-size'
		]

		for (const className of motionClasses) {
			expect(animated).toContain(className)
			expect(settled).not.toContain(className)
		}
	})
})
