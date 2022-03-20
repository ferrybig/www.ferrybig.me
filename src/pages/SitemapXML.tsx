import { createElement } from "../jsx/jsx-runtime";
import { PartialBase } from "../PageBase";

interface Props {
	partialBase: PartialBase,
}

export default function SitemapXML({ partialBase }: Props) {
	return createElement(
		'urlset',
		{
			xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
			'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
			'xsi:schemaLocation': "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
		},
		partialBase.urls.map(e => createElement('url', {}, [
			createElement('loc', {}, partialBase.site ? `${partialBase.site}${e.loc.substring(1)}` : e.loc),
			e.lastmod && createElement('lastmod', {}, e.lastmod),
		]))
	);
}
