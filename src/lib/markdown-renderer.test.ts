import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import { MarkdownRenderer, parseMarkdown } from './index'
import { MarkdownStream } from './stream'

describe('MarkdownRenderer', () => {
	it('renders parsed nodes without streaming animations', () => {
		const nodes = parseMarkdown('# Guide\n\n> Quoted text\n\n- [x] Done\n\n```js\nconst value = 1\n```')
		const body = render(MarkdownRenderer, {
			props: { nodes, idPrefix: 'docs', class: 'custom-document', 'aria-label': 'Document' }
		}).body

		expect(body).toContain('id="docs-guide"')
		expect(body).toContain('markdown-svelte custom-document')
		expect(body).toContain('aria-label="Document"')
		expect(body).toContain('const value = 1')
		expect(body).not.toContain('markdown-svelte-stream')
		expect(body).not.toContain('height: calc(')
	})
})

describe.each([
	{ name: 'MarkdownRenderer', Renderer: MarkdownRenderer, animated: false },
	{ name: 'MarkdownStream', Renderer: MarkdownStream, animated: true }
])('$name code blocks', ({ Renderer, animated }) => {
	it('renders both diff panes and uses the current code when the updated pane is omitted', () => {
		const body = render(Renderer, {
			props: {
				nodes: [
					{
						type: 'code_block',
						language: 'html',
						diff: true,
						originalCode: '<old>\n',
						code: '<new>\nsecond line',
						raw: ''
					}
				]
			}
		}).body

		expect(body).toContain('diff / html')
		expect(body).toMatch(/<code\b[^>]*>&lt;old>\n<\/code>/)
		expect(body).toMatch(/<code\b[^>]*>&lt;new>\nsecond line<\/code>/)
		expect(body.match(/<pre\b/g)).toHaveLength(2)
		if (animated) {
			expect(body).toContain('height: calc(2rem + 1lh)')
			expect(body).toContain('height: calc(2rem + 2lh)')
		} else {
			expect(body).not.toContain('height: calc(')
		}
	})
})
