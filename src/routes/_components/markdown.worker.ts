import { getMarkdown, parseMarkdownToStructure } from 'stream-markdown-parser'
import type { ParsedMarkdownNode } from '$lib/stream'

export interface ParseRequest {
	version: number
	value: string
	reset: boolean
	final: boolean
}

export interface ParseResponse {
	version: number
	nodes: ParsedMarkdownNode[]
	cursor: number
	final: boolean
}

// The worker owns the parser and source buffer; the UI only receives parsed nodes.
const parser = getMarkdown('markdown-svelte-playground')
let buffer = ''

self.onmessage = ({ data }: MessageEvent<ParseRequest>) => {
	if (data.reset) {
		parser.stream?.reset?.()
		buffer = ''
	}
	buffer += data.value
	self.postMessage({
		version: data.version,
		nodes: parseMarkdownToStructure(buffer, parser, {
			final: data.final,
			reuseStableTopLevelNodes: true
		}),
		cursor: buffer.length,
		final: data.final
	} satisfies ParseResponse)
}
