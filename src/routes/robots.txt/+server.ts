import { PUBLIC_BASE_URL } from '$env/static/public'

export const prerender = true

export function GET() {
	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', PUBLIC_BASE_URL).href}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	})
}
