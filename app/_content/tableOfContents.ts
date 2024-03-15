import { Root} from 'mdast';
import Slugger from 'github-slugger';
import { TableOfContentsEntry } from './types';
import nodeToText from './nodeToText';

function tableOfContents (tree: Root, maxDepth: number): TableOfContentsEntry[] {
	const toc: TableOfContentsEntry[] = [];
	const slugger = new Slugger();
	for (const node of tree.children) {
		if (node.type === 'heading') {
			const text = nodeToText(node);
			const slug = slugger.slug(text); // This needs to run always in the case of conflicting subheadings
			if (node.depth > maxDepth) continue;
			toc.push({
				lvl: node.depth,
				slug: slug,
				title: text,
			});
		}
	}
	return toc;
}
export default tableOfContents;
