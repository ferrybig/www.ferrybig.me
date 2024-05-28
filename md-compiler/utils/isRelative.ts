import { isAbsolute } from 'node:path/posix';

const absolutePathRegex = /^(?:[a-z]+:)?\/\//;

function isRelative(path: string) {
	if (absolutePathRegex.exec(path)) {
		return false;
	}
	return !isAbsolute(path) && !path.startsWith('/');
}
export default isRelative;
