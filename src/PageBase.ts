export interface SitemapEntry {
	loc: string,
	file: string,
	lastmod?: string,
	renderedBy: string,
}

export default interface PageBase {
	assets: Record<string, string>,
	publicPath: string,
	site: string | null,
	urls: SitemapEntry[];
	js: string[],
	css: string[],
	link: Record<string, string | null>,
}
export type PartialBase = Omit<PageBase, 'link'>;
export function writeLinkToAsset(base: PageBase, resource: string) {
	if(!(resource in base.assets)) {
		throw new Error('Resource not found: ' + resource);
	}
	return `${base.publicPath}${base.assets[resource]}`;
}
