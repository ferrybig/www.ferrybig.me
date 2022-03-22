import ContentDefinition from '../types/ContentDefinition';
import findOrCreate from '../utils/findOrCreate';
import paginate from '../utils/paginate';
import sortByKey from '../utils/sortByKey';
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
})).sort(sortByKey('date', false, sortByKey('created', false)));


type PaginatedContent = ContentDefinition[][];
function makeOverview(posts: ContentDefinition[], paginateSize = 12): {
	everything: PaginatedContent,
	perYear: {
		year: string,
		next: null | {
			year: string,
		},
		previous: null | {
			year: string,
		},
		content: PaginatedContent,
	}[],
	perPeriod: {
		year: string,
		month: string,
		next: null | {
			year: string,
			month: string,
		},
		previous: null | {
			year: string,
			month: string,
		},
		content: PaginatedContent,
	}[],
	perTag: {
		tag: string,
		content: PaginatedContent,
	}[],
} {
	const perYear: {
		year: string,
		next: null | {
			year: string,
		},
		previous: null | {
			year: string,
		},
		content: ContentDefinition[],
	}[] = [];
	const perPeriod: {
		year: string,
		month: string,
		next: null | {
			year: string,
			month: string,
		},
		previous: null | {
			year: string,
			month: string,
		},
		content: ContentDefinition[],
	}[] = [];
	const perTag: {
		tag: string,
		content: ContentDefinition[],
	}[] = [];
	const everything: ContentDefinition[] = [];
	for (const post of posts) {
		if (!post.hidden) {
			everything.push(post);
			findOrCreate(perYear, i => i.year === post.date.substring(0, 4), () => ({
				year: post.date.substring(0, 4),
				content: [],
				next: null,
				previous: null,
			})).content.push(post);
			findOrCreate(
				perPeriod,
				i => i.year === post.date.substring(0, 4) && i.month === post.date.substring(5, 7),
				() => ({
					year: post.date.substring(0, 4),
					month: post.date.substring(5, 7),
					content: [],
					next: null,
					previous: null,
				})
			).content.push(post);
		}
		for (const tag of [...post.tags, ...post.extraTags]) {
			findOrCreate(perTag, i => i.tag === tag, () => ({
				tag,
				content: [],
			})).content.push(post);
		}
	}
	return {
		everything: paginate(everything, paginateSize),
		perYear: perYear.map(data => ({
			...data,
			content: paginate(data.content, paginateSize)
		})),
		perPeriod: perPeriod.map(data => ({
			...data,
			content: paginate(data.content, paginateSize)
		})),
		perTag: perTag.map(data => ({
			...data,
			content: paginate(data.content, paginateSize)
		})),
	}
}

export const {
	everything,
	perPeriod,
	perTag,
	perYear,
} = makeOverview(content);

export default content;
