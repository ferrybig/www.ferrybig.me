import { JSXNode } from './jsx/jsx-runtime';

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
	meta: Record<string, string | null>,
	head: JSXNode[],
	// eslint-disable-next-line semi
}
export function writeLinkToAsset(base: PageBase, resource: string) {
	if(!(resource in base.assets)) {
		throw new Error('Resource not found: ' + resource);
	}
	return `${base.publicPath}${base.assets[resource]}`;
}
export function fullPath(base: PageBase, link: string) {
	return base.site + base.publicPath.substring(1) + link.substring(1);
}
export function tryFullPath(base: PageBase, link: string) {
	if (link.startsWith('//') || link.startsWith('http://') || link.startsWith('https://')) {
		return link;
	}
	return base.site + base.publicPath.substring(1) + link.substring(1);
}
