export default interface PageBase {
	canonical: string,
	assets: Record<string, string>,
	publicPath: string,
}
export function writeLinkToAsset(base: PageBase, resource: string) {
	if(!(resource in base.assets)) {
		throw new Error('Resource not found: ' + resource);
	}
	return `${base.publicPath}${base.assets[resource]}`;
}
