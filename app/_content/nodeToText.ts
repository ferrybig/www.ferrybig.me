
import {PhrasingContent, Heading, Root, RootContent} from 'mdast';

function nodeToText(node: PhrasingContent | Heading | Root | RootContent): string {
	if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'html') {
		return node.value;
	} else if (node.type === 'image') {
		return node.alt ?? '';
	} else if ('children' in node) {
		return node.children.map(nodeToText).join('');
	} else {
		return '';
	}
}
export default nodeToText;
