import { PUBLIC_BASE_URL } from '$env/static/public'

export const prerender = true

export function GET() {
	const entries = ['/', '/docs/', '/docs/styling/', '/examples/']
		.map((path) => `  <url><loc>${new URL(path, PUBLIC_BASE_URL).href}</loc></url>`)
		.join('\n')

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
		{ headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
	)
}
