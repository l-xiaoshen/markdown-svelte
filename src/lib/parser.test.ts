import { getMarkdown, parseMarkdownToStructure } from 'stream-markdown-parser'
import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import { parseMarkdown } from './parser'
import MarkdownStream from './stream/markdown-stream.svelte'

function createStream() {
	const parser = getMarkdown('parser-regression-test')

	return {
		parse: (source: string, final = false) =>
			parseMarkdownToStructure(source, parser, { final, reuseStableTopLevelNodes: true }),
		reset: () => parser.stream?.reset?.()
	}
}

describe('stream-markdown-parser integration', () => {
	it('reuses completed top-level nodes while replacing the growing tail', () => {
		const stream = createStream()
		const source = '# Stable\n\nCompleted paragraph.\n\nGrowing'
		const first = stream.parse(source)
		const appended = stream.parse(`${source} tail`)

		expect(appended[0]).toBe(first[0])
		expect(appended[1]).toBe(first[1])
		expect(appended[2]).not.toBe(first[2])
		expect(first[2]).toMatchObject({ raw: 'Growing' })
		expect(appended[2]).toMatchObject({ raw: 'Growing tail' })
		expect(render(MarkdownStream, { props: { nodes: appended, animate: false } }).body).toContain('Growing tail')
	})

	it('settles an unfinished code fence when the same buffer is finalized', () => {
		const stream = createStream()
		const source = '```ts\nconst value = 1'
		const partial = stream.parse(source)
		const finalized = stream.parse(source, true)

		expect(partial).toMatchObject([{ type: 'code_block', code: 'const value = 1', loading: true }])
		expect(finalized).toMatchObject([{ type: 'code_block', code: 'const value = 1', loading: false }])
	})

	it('restores unfinished math to literal text when the same buffer is finalized', () => {
		const stream = createStream()
		const source = '$$\nx + y'
		const partial = stream.parse(source)
		const finalized = stream.parse(source, true)

		expect(partial).toMatchObject([{ type: 'math_block', content: 'x + y', loading: true }])
		expect(finalized).toMatchObject([{ type: 'paragraph', children: [{ type: 'text', content: source }] }])
		expect(finalized).toEqual(parseMarkdown(source))
	})

	it('resolves an earlier reference when its definition arrives in a later chunk', () => {
		const stream = createStream()
		const source = '# Guide\n\nRead [the API][api].\n\nAnother paragraph.\n\n'
		const partial = stream.parse(source)
		const resolved = stream.parse(`${source}[api]: https://example.com/docs\n`)
		const partialBody = render(MarkdownStream, { props: { nodes: partial, animate: false } }).body
		const resolvedBody = render(MarkdownStream, { props: { nodes: resolved, animate: false } }).body

		expect(partialBody).toContain('Read [the API][api].')
		expect(partialBody).not.toContain('href="https://example.com/docs"')
		expect(resolvedBody).toContain('href="https://example.com/docs"')
		expect(resolved[1]).not.toBe(partial[1])
	})

	it('resets document references before parsing another stream with the same opening paragraph', () => {
		const stream = createStream()
		const source = 'Read [the API][api].\n\n'
		const oldDocument = stream.parse(`${source}[api]: https://example.com/old\n`)
		stream.reset()
		const newDocument = stream.parse(`${source}New document`)
		const body = render(MarkdownStream, { props: { nodes: newDocument, animate: false } }).body

		expect(render(MarkdownStream, { props: { nodes: oldDocument, animate: false } }).body).toContain(
			'href="https://example.com/old"'
		)
		expect(body).toContain('Read [the API][api].')
		expect(body).toContain('New document')
		expect(body).not.toContain('href="https://example.com/old"')
	})

	it('discards reused nodes on reset even when the new stream extends the old buffer', () => {
		const stream = createStream()
		const source = '# Stable\n\nCompleted paragraph.\n\nGrowing'
		const oldDocument = stream.parse(source)
		stream.reset()
		const newDocument = stream.parse(`${source} in a new stream`)

		expect(newDocument[0]).toEqual(oldDocument[0])
		expect(newDocument[0]).not.toBe(oldDocument[0])
		expect(newDocument[1]).not.toBe(oldDocument[1])
		expect(newDocument[2]).toMatchObject({ raw: 'Growing in a new stream' })
	})
})

describe('parseMarkdown', () => {
	it('keeps reference definitions isolated between independent static documents', () => {
		const source = 'Read [the API][api].'
		const defined = parseMarkdown(`${source}\n\n[api]: https://example.com/first`)
		parseMarkdown('# An unrelated document\n\n```ts\nconst value = 1')
		const undefinedReference = parseMarkdown(source)
		const redefined = parseMarkdown(`${source}\n\n[api]: https://example.com/second`)

		expect(render(MarkdownStream, { props: { nodes: defined, animate: false } }).body).toContain(
			'href="https://example.com/first"'
		)
		expect(undefinedReference).toMatchObject([{ type: 'paragraph', children: [{ type: 'text', content: source }] }])
		const body = render(MarkdownStream, { props: { nodes: redefined, animate: false } }).body
		expect(body).toContain('href="https://example.com/second"')
		expect(body).not.toContain('https://example.com/first')
	})

	it('preserves numeric tilde ranges alongside subscript syntax', () => {
		const nodes = parseMarkdown('18~24 and H~2~O')

		expect(nodes).toMatchObject([
			{
				type: 'paragraph',
				children: [
					{ type: 'text', content: '18~24 and H' },
					{ type: 'subscript', children: [{ type: 'text', content: '2' }] },
					{ type: 'text', content: 'O' }
				]
			}
		])
	})
})
