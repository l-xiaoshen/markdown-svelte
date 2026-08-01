import { isUnsafeHtmlUrl, sanitizeImageSrc } from 'stream-markdown-parser'

const ALLOWED_LINK_PROTOCOL = /^(https?|mailto|tel):/i
const URL_PROTOCOL = /^[a-z][a-z\d+.-]*:/i

export function safeLinkHref(value: string, baseUrl?: string | URL): string | null {
	const href = value.trim()
	if (
		!href ||
		/^[\\/]{2}/.test(href) ||
		/[\u0000-\u001f\u007f]/.test(href) ||
		isUnsafeHtmlUrl(href, { tagName: 'a', attrName: 'href' })
	) {
		return null
	}

	if (URL_PROTOCOL.test(href) && !ALLOWED_LINK_PROTOCOL.test(href)) {
		return null
	}

	const resolved = resolveRelativeUrl(href, baseUrl)
	if (
		isUnsafeHtmlUrl(resolved, { tagName: 'a', attrName: 'href' }) ||
		(URL_PROTOCOL.test(resolved) && !ALLOWED_LINK_PROTOCOL.test(resolved))
	) {
		return null
	}
	return resolved
}

export function safeImageSource(value: string, baseUrl?: string | URL): string | null {
	const source = sanitizeImageSrc(value)
	if (!source || /^[\\/]{2}/.test(source)) {
		return null
	}

	const resolved = resolveRelativeUrl(source, baseUrl)
	return sanitizeImageSrc(resolved) || null
}

function resolveRelativeUrl(value: string, baseUrl?: string | URL): string {
	if (!baseUrl || value.startsWith('#') || URL_PROTOCOL.test(value)) {
		return value
	}

	try {
		const base = baseUrl instanceof URL ? baseUrl : new URL(baseUrl)
		if (base.protocol !== 'http:' && base.protocol !== 'https:') {
			return value
		}
		return new URL(value, base).href
	} catch {
		return value
	}
}
