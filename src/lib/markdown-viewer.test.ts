import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import MarkdownViewer from './markdown-viewer.svelte'

function withoutSvelteMarkers(value: string): string {
	return value.replace(/<!--.*?-->/g, '')
}

describe('MarkdownViewer', () => {
	it('renders semantic Markdown on the server', () => {
		const body = withoutSvelteMarkers(
			render(MarkdownViewer, {
				props: {
					markdown: '# **Guide**\n\nRead [the API](./api).\n\n- [x] Parsed\n\nText[^1].\n\n[^1]: A note.',
					baseUrl: 'https://docs.example.dev/start/',
					idPrefix: 'demo'
				}
			}).body
		)

		expect(body).toContain('id="demo-guide"')
		expect(body).toContain('class="markdown-svelte-strong"')
		expect(body).toContain('>Guide</span>')
		expect(body).toContain('href="https://docs.example.dev/start/api"')
		expect(body).toContain('type="checkbox"')
		expect(body).toContain('id="demo-footnote-1"')
		expect(body).toContain('Back to footnote reference 1')
	})

	it('escapes raw HTML by default', () => {
		const body = withoutSvelteMarkers(
			render(MarkdownViewer, {
				props: {
					markdown: '<div>block</div>\n\nbefore <strong>inline</strong> after'
				}
			}).body
		)

		expect(body).toContain('&lt;div>block&lt;/div>')
		expect(body).toContain('&lt;strong>inline&lt;/strong>')
		expect(body).not.toContain('<div>block</div>')
		expect(body).not.toContain('<strong>inline</strong>')
	})

	it('keeps block HTML out of phrasing elements', () => {
		const body = withoutSvelteMarkers(
			render(MarkdownViewer, {
				props: {
					markdown: 'before <h2>title</h2> after\n\n# before <div>box</div> after\n\nbefore <li>item</li> after',
					allowRawHtml: true
				}
			}).body
		)

		expect(body).toContain('<h2>title</h2>')
		expect(body).toContain('&lt;div>box&lt;/div>')
		expect(body).toContain('&lt;li>item&lt;/li>')
		expect(body).not.toMatch(/<(?:p|h1|a|strong)[^>]*>(?:(?!<\/(?:p|h1|a|strong)>)[\s\S])*<(?:div|h2|li)>/)
	})

	it('scopes local heading and footnote links without duplicate IDs', () => {
		const body = render(MarkdownViewer, {
			props: {
				markdown: '## Usage\n\n[Jump](#usage)\n\nFirst[^x] and second[^x].\n\n[^x]: Shared note.',
				idPrefix: 'readme'
			}
		}).body
		const ids = [...body.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])

		expect(body).toContain('href="#readme-usage"')
		expect(new Set(ids).size).toBe(ids.length)
	})
})
