import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import { parseMarkdown } from '../parser'
import MarkdownStream from './markdown-stream.svelte'
import { resolveStreamingText } from './streaming-text.svelte'

describe('MarkdownStream', () => {
	it('renders parsed nodes through the stream entrypoint', () => {
		const nodes = parseMarkdown('Hello `stream`')
		const animated = render(MarkdownStream, { props: { nodes } }).body
		const settled = render(MarkdownStream, { props: { nodes, animate: false } }).body

		expect(animated).toContain('data-markdown-svelte-stream=""')
		expect(animated).toContain('markdown-svelte-stream-enter')
		expect(settled).toContain('Hello ')
		expect(settled).not.toContain('markdown-svelte-stream-enter')
	})

	it('only separates append-only text updates', () => {
		expect(resolveStreamingText('streaming', 'stream', true)).toEqual({
			stableContent: 'stream',
			deltaContent: 'ing'
		})
		expect(resolveStreamingText('replacement', 'stream', true)).toEqual({
			stableContent: 'replacement',
			deltaContent: ''
		})
	})
})
