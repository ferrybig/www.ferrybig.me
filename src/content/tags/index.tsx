import * as carriers from './carriers.md';
import * as blog from './blog.md';
import * as _3dModels from './3d-models.md';
import * as openscad from './openscad.md';

function namedTag(name: string, input: typeof import('*.md')) {
	return {
		...input,
		slug: name,
	}
}

export default [
	namedTag('blog', blog),
	namedTag('carriers', carriers),
	namedTag('3d-models', _3dModels),
	namedTag('openscad', openscad),
]
