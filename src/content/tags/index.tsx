import * as career from './career.md';
import * as blog from './blog.md';
import * as things from './things.md';
import * as openscad from './openscad.md';

function namedTag(name: string, input: typeof import('*.md')) {
	return {
		...input,
		slug: name,
	};
}

export default [
	namedTag('blog', blog),
	namedTag('career', career),
	namedTag('things', things),
	namedTag('openscad', openscad),
];
