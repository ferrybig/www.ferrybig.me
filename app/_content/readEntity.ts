import remarkParse from 'remark-parse';
import { unified } from 'unified';
import processFile from './processFile';
import tableOfContents from './tableOfContents';
import { DEFAULT_TABLE_OF_CONTENTS_MAX_DEPTH } from '@/metadata';

async function readBase(tagName: string) {
	const {
		content,
		data,
		filename,
	} = await processFile(tagName);

	const tree = unified()
		.use(remarkParse)
		.parse(content);
	const tableOfContent = tableOfContents(tree, 'tocMaxDepth' in data && typeof data.tocMaxDepth === 'number' ? data.tocMaxDepth : DEFAULT_TABLE_OF_CONTENTS_MAX_DEPTH);
	return {
		filename,
		content,
		data,
		tree,
		tableOfContent,
	};
}
export default readBase;
