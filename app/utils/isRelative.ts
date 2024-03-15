import { isAbsolute } from 'path';

const absolutePathRegex = /^(?:[a-z]+:)?\/\//;

export default function isRelative(path: string) {
	if (absolutePathRegex.exec(path)) {
		return false;
	}
	return !isAbsolute(path) && !path.startsWith('/');
}
