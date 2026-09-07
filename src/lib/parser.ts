import { getMarkdown, parseMarkdownToStructure } from 'stream-markdown-parser'
import type { ParsedMarkdownNode } from './renderable-node'
import { safeLinkHref } from './url-policy'

const parser = getMarkdown('markdown-svelte', {
	markdownItOptions: {
		breaks: true,
		linkify: true,
		typographer: true
	}
})

export function parseMarkdown(source: string): ParsedMarkdownNode[] {
	// This shared instance only handles complete documents; never retain streaming state between calls.
	return parseMarkdownToStructure(source, parser, {
		final: true,
		streamParse: false,
		validateLink: (url) => safeLinkHref(url) !== null
	})
}
