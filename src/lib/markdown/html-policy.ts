import { sanitizeHtmlContent } from 'stream-markdown-parser'

export function safeHtml(value: string): string {
	return sanitizeHtmlContent(value, 'safe')
}
