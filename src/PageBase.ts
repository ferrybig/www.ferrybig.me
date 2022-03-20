export interface SitemapEntry {
	loc: string,
	file: string,
	lastmod?: string,
	renderedBy: string,
}

export default interface PageBase {
	canonical: string | null,
	assets: Record<string, string>,
	publicPath: string,
	site: string | null,
	urls: SitemapEntry[];
	js: string[],
}
export type PartialBase = Omit<PageBase, 'canonical'>;
export function writeLinkToAsset(base: PageBase, resource: string) {
	if(!(resource in base.assets)) {
		throw new Error('Resource not found: ' + resource);
	}
	return `${base.publicPath}${base.assets[resource]}`;
}
