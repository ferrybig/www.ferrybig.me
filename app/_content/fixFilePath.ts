import { basename, dirname, join } from 'path';

export default function fixFilePath(filename: string) {
	if (!filename.endsWith('/index.md')) return (i: string) => i;
	const dir = basename(dirname(filename));
	return (i: string) => join(dir, i);
}
