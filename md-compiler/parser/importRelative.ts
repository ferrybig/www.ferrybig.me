import {relative } from 'node:path';

export default function importRelative(from: string, to: string): string {
	const transformed = relative(from, to);
	if (transformed[0] === '.' && (transformed[1] ==='/' || (transformed[1] === '.' && transformed[2] === '/'))) return transformed;
	return `./${transformed}`;
}
