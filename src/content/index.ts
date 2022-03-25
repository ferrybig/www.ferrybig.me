import ContentDefinition from '../types/ContentDefinition';
import findOrCreate from '../utils/findOrCreate';
import paginate from '../utils/paginate';
import sortByKey from '../utils/sortByKey';
import importedTags from './tags';
import blog from './blog';
import carriers from './carriers';
import { DateTime } from 'luxon';

function decodeEntities(encodedString: string) {
	const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
	const translate: Partial<Record<string, string>> = {
		'nbsp':' ',
		'amp' : '&',
		'quot': '"',
		'lt'  : '<',
		'gt'  : '>'
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
	return { title: decodeEntities(match[1].replace(/<\/?[^>]+(>|$)/g, '')), titleHTML: match[1], body: body.substring(match[0].length) };
}

function mdToContentDefinition({default: body, endDate, date, created, updated, hidden, ...rest}: typeof import('*.md')): ContentDefinition {
	return {
		...rest,
		date: DateTime.fromISO(date),
		endDate: endDate ? DateTime.fromISO(endDate) : null,
		created: created ? DateTime.fromRFC2822(created) : DateTime.now(),
		updated: updated ? DateTime.fromRFC2822(updated) : DateTime.now(),
		hidden: hidden ?? false,
		...split(body, rest.slug),
	};
}
const tags: Partial<Record<string, ContentDefinition>> = {};
for (const tag of importedTags) {
	tags[tag.slug] = mdToContentDefinition(tag);
}

const content: ContentDefinition[] = [...blog, ...carriers]
	.map(mdToContentDefinition)
	.sort(sortByKey('date', false, sortByKey('created', false)));


type PaginatedContent = ContentDefinition[][];
function makeOverview(posts: ContentDefinition[], paginateSize = 12): {
	homePage: PaginatedContent,
	perPeriod: {
		year: number,
		month: number,
		content: ContentDefinition[],
	}[],
	perTag: {
		tag: string,
		tagContent: ContentDefinition | null,
		content: PaginatedContent,
	}[],
} {
	const perPeriod: {
		year: number,
		month: number,
		content: ContentDefinition[],
	}[] = [];
	const perTag: {
		tag: string,
		tagContent: ContentDefinition | null,
		content: ContentDefinition[],
	}[] = [];
	const everything: ContentDefinition[] = [];
	for (const post of posts) {
		if (!post.hidden) {
			everything.push(post);
			findOrCreate(
				perPeriod,
				i => i.year === post.date.year && i.month === post.date.month,
				() => ({
					year: post.date.year,
					month: post.date.month,
					content: [],
					next: null,
					previous: null,
				})
			).content.push(post);
		}
		for (const tag of [...post.tags, ...post.extraTags]) {
			findOrCreate(perTag, i => i.tag === tag, () => ({
				tag,
				tagContent: tags[tag] ?? null,
				content: [],
			})).content.push(post);
		}
	}
	return {
		homePage: paginate(everything, paginateSize),
		perPeriod: perPeriod.map(data => ({
			...data,
			content: data.content
		})),
		perTag: perTag.map(data => ({
			...data,
			content: paginate(data.content, paginateSize)
		})),
	}
}

export const {
	homePage,
	perPeriod,
	perTag,
} = makeOverview(content);

export default content;
