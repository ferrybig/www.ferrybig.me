import path from 'node:path/posix';
import { visit } from 'unist-util-visit';
import sizeOf from 'image-size';
/**
 * Handles:
 * "//"
 * "http://"
 * "https://"
 * "ftp://"
 */
const absolutePathRegex = /^(?:[a-z]+:)?\/\//;

function getImageSize(src: string, dir: string) {
	if (absolutePathRegex.exec(src)) {
		return;
	}
	// Treat `/` as a relative path, according to the server
	const shouldJoin = !path.isAbsolute(src) || src.startsWith('/');

	if (dir && shouldJoin) {
		src = path.join(dir, src);
	}
	return sizeOf.default(src);
}

function setImageSize(options: { dir: string }) {
	const dir = options.dir;

	return function transformer(tree: any) {
		visit(tree, 'element', (node) => {
			if (node.tagName === 'img') {
				const src = node.properties.src;
				const split = src.split('#');

				const dimensions = getImageSize(split[0], dir);
				if (!dimensions || !dimensions.height || !dimensions.width)
					return;

				const params = new URLSearchParams(split[1] ?? '');
				node.properties.width =
					params.get('width') ? params.get('width') :
					params.get('height') ? (Number.parseFloat(params.get('height') ?? '') / dimensions.height) * dimensions.width :
					dimensions.width;
				node.properties.height =
					params.get('height') ? params.get('height') :
					params.get('width') ? (Number.parseFloat(params.get('width') ?? '') / dimensions.width) * dimensions.height :
					dimensions.height;
			}
		});
	};
}
export default setImageSize;
