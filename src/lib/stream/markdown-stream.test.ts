import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import { parseMarkdown } from '../parser'
import { MarkdownStream } from './index'

describe('MarkdownStream', () => {
	it('requires raw HTML rendering to be explicitly enabled', () => {
		const nodes = parseMarkdown('<div>block</div>\n\nbefore <strong>inline</strong> after')
		const escaped = render(MarkdownStream, { props: { nodes } }).body
		const rendered = render(MarkdownStream, {
			props: { nodes, allowRawHtml: true }
		}).body

		expect(escaped).toContain('&lt;div>block&lt;/div>')
		expect(escaped).toContain('&lt;strong>inline&lt;/strong>')
		expect(escaped).not.toContain('<div>block</div>')
		expect(rendered).toContain('<div>block</div>')
		expect(rendered).toContain('<strong>inline</strong>')
	})

	it('renders parsed nodes with streaming animations', () => {
		const nodes = parseMarkdown(
			'> Quoted text\n\n- [x] Done\n\n```js\nconst value = 1\n```\n\n---\n\nText[^note].\n\n[^note]: Footnote.'
		)
		const body = render(MarkdownStream, {
			props: { nodes, class: 'custom-document', 'aria-label': 'Stream' }
		}).body

		expect(body).toContain('data-markdown-svelte-stream=""')
		expect(body).toContain('markdown-svelte-stream custom-document')
		expect(body).toContain('aria-label="Stream"')
		for (const name of ['block-enter', 'list-item', 'code-size', 'rule', 'footnote', 'delta']) {
			expect(body).toContain(`markdown-svelte-stream-${name}`)
		}
		expect(body).toContain('height: calc(2rem + 1lh)')
	})
})
