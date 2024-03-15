import { basename } from 'path';
import { visit } from 'unist-util-visit';
import isRelative from './isRelative';

function rehypeDownloadAttribute() {
	return function transformer(tree: any) {

		visit(tree, 'element', (node) => {
			if (node.tagName === 'a' && typeof node.properties.href === 'string') {
				const href = node.properties.href.toLowerCase();
				if (
					isRelative(href) &&
					basename(href).includes('.') &&
					!href.endsWith('.html') &&
					!href.endsWith('.png') &&
					!href.endsWith('.jpg') &&
					!href.endsWith('.jpeg') &&
					!href.endsWith('.svg') &&
					!href.endsWith('.gif') &&
					!href.endsWith('.pdf') &&
					!href.endsWith('.webp') &&
					!href.endsWith('.apng') &&
					!href.endsWith('.avif')
				) {
					node.properties.download = '';
				}
			}
		});
	};
}
export default rehypeDownloadAttribute;
