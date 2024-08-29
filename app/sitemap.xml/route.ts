import { SITE_URL } from '@/metadata';
import { getAllPosts, hasFeeds } from '../content';

export function GET() {
	const items = getAllPosts()
		//.filter(({ commentStatus }) => commentStatus !== 'disabled')
		.map(({ updatedAt, slug, summary, readingTimeMax }, id) => ({
			url: slug,
			updatedAt,
			priority:
				0.5 +
				Math.min(Math.max(readingTimeMax * 0.05 - 0.1, 0), 0.3) +
				(slug === '' || !hasFeeds(id) ? 0 : -0.2) +
				(summary ? 0 : -0.2),
		}));
	let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
	xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
	for (const { url, updatedAt, priority } of items) {
		xml += '<url>';
		xml += `<loc>${new URL(url, SITE_URL).href}</loc>`;
		xml += `<lastmod>${new Date(updatedAt).toISOString()}</lastmod>`;
		xml += `<priority>${priority}</priority>`;
		xml += '</url>\n';
	}
	xml += '</urlset>\n';

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' },
	});
}
export const dynamic = 'force-static';
