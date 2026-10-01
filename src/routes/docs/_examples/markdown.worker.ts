import { getMarkdown, parseMarkdownToStructure } from 'stream-markdown-parser'

const parser = getMarkdown('answer')
let source = ''

self.onmessage = ({ data }: MessageEvent<{ chunk: string; final?: boolean }>) => {
	source += data.chunk
	self.postMessage(
		parseMarkdownToStructure(source, parser, {
			final: data.final ?? false,
			reuseStableTopLevelNodes: true
		})
	)
}
