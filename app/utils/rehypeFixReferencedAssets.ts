import { visit } from 'unist-util-visit';
import isRelative from './isRelative';
import fixFilePath from '@/_content/fixFilePath';

const REMAP_LIST: [string, string][] = [
	['img', 'src'],
	['a', 'href'],
	['source', 'src'],
];

function rehypeFixReferencedPages(options: { filename: string, baseUrl?: URL | undefined }) {
	const mapper = fixFilePath(options.filename);

	return function transformer(tree: any) {
		visit(tree, 'element', (node) => {
			for (const [tag, attr] of REMAP_LIST) {
				if (node.tagName === tag && typeof node.properties[attr] === 'string' && isRelative(node.properties[attr])) {
					let url = mapper(node.properties[attr]);
					if (options.baseUrl) url = new URL(url, options.baseUrl).href;
					node.properties[attr] = url;
				}
			}
		});
	};
}
export default rehypeFixReferencedPages;

