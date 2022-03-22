import ContentDefinition from '../types/ContentDefinition';
import blog from './blog';
import carriers from './carriers';

function decodeEntities(encodedString: string) {
	const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
	const translate: Partial<Record<string, string>> = {
		"nbsp":" ",
		"amp" : "&",
		"quot": "\"",
		"lt"  : "<",
		"gt"  : ">"
	};
	return encodedString.replace(translate_re, function(match, entity) {
		return translate[entity] ?? '';
	}).replace(/&#(\d+);/gi, function(match, numStr) {
		const num = parseInt(numStr, 10);
		return String.fromCharCode(num);
	});
}

function split(body: string, slug: string): { title: string, titleHTML: string, body: string} {
	const match = body.match(/<h[1-6](?: [^=>]+(?:=[^=>]+))*?>(.*?)<\/h[1-6]>/m);
	if (!match) {
		return { titleHTML: slug, title: slug, body };
	}
	return { title: decodeEntities(match[1].replace(/<\/?[^>]+(>|$)/g, "")), titleHTML: match[1], body: body.substring(match[0].length) };
}

const content: ContentDefinition[] = [...blog, ...carriers].map(({default: body, endDate, hidden, ...rest}) => ({
	...rest,
	endDate: endDate ?? null,
	hidden: hidden ?? false,
	...split(body, rest.slug),
}));


export const contentVisible = content.filter(e => !e.hidden);
const tags = [...new Set(content.flatMap(md => [...md.tags, ...md.extraTags])).keys()]

/*
export const byTag: {
	tag: string,
	content: ContentDefinition[]
}[] = tags.map()
*/
export default content;
