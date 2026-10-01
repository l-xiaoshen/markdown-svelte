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

	it('linkifies appended domains and email after a first chunk containing only plain text', () => {
		const stream = createStream()
		const partial = stream.parse('Visit our website')
		const source = 'Visit our website example.com and email support@example.com.'
		const appended = stream.parse(source)
		const finalized = stream.parse(source, true)

		expect(render(MarkdownStream, { props: { nodes: partial, animate: false } }).body).not.toContain('<a ')
		for (const nodes of [appended, finalized]) {
			const body = render(MarkdownStream, { props: { nodes, animate: false } }).body

			expect(body.match(/href="http:\/\/example\.com"/g)).toHaveLength(1)
			expect(body.match(/href="mailto:support@example\.com"/g)).toHaveLength(1)
			expect(body).toContain('Visit our website ')
		}
	})

	it('preserves details content when an unclosed wrapper and repeated text arrive in later chunks', () => {
		const stream = createStream()
		const firstDetails = '<details>\n<summary>First summary</summary>\n\n- x1\n- y1\n\n</details>\n\n'
		const nestedDetails = '<details>\n<summary>Second summary</summary>\n\n- p2\n- q2\n\n</details>\n'
		const prefix = `${firstDetails}<div class="same">\nBETA\n\n\n`
		const chunks = [
			`${prefix}${nestedDetails.slice(0, nestedDetails.indexOf('- q2'))}`,
			`${prefix}${nestedDetails}`,
			`${prefix}${nestedDetails}\n<div class="same">\nDELTA\n</div>\n\ntrailing copy:\nx1\ny1`
		]

		for (const source of chunks) {
			const nodes = stream.parse(source)
			const body = render(MarkdownStream, {
				props: { nodes, animate: false, allowRawHtml: true }
			}).body

			expect(body.match(/First summary/g)).toHaveLength(1)
			expect(body.match(/Second summary/g)).toHaveLength(1)
			expect(body.match(/<li>x1<\/li>/g)).toHaveLength(1)
			expect(body.match(/- p2/g)).toHaveLength(1)
		}

		const source = chunks[chunks.length - 1]
		const finalized = stream.parse(source, true)
		// The later x1/y1 paragraph must not move the nested details source boundary.
		expect(finalized).toMatchObject([
			{ type: 'html_block', tag: 'details' },
			{
				type: 'html_block',
				tag: 'div',
				loading: false,
				children: expect.arrayContaining([
					expect.objectContaining({
						tag: 'details',
						raw: nestedDetails,
						children: expect.arrayContaining([expect.objectContaining({ type: 'list', raw: 'p2\nq2' })])
					})
				])
			}
		])
		const renderBody = (nodes: ReturnType<typeof parseMarkdown>) =>
			render(MarkdownStream, { props: { nodes, animate: false, allowRawHtml: true } }).body.replace(/<!--.*?-->/g, '')
		const finalizedBody = renderBody(finalized)

		expect(finalizedBody).toBe(renderBody(parseMarkdown(source)))
		expect(finalizedBody.match(/Second summary/g)).toHaveLength(1)
		expect(finalizedBody.match(/- p2\n- q2/g)).toHaveLength(1)
		expect(finalizedBody.match(/trailing copy:\nx1\ny1/g)).toHaveLength(1)
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
