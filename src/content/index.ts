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

function split(html: string, slug: string): { title: string, summary: string, body: string} {
	const regex = /<(h[1-6])(?:\W[^=>]+(?:=[^=>]+))*?>(.*?)<\/\1>/mg;
	const match = regex.exec(html);
	if (!match) {
		return { title: slug, body: html, summary: ''};
	}
	const title = decodeEntities(match[2].replace(/<\/?[^>]+(>|$)/g, ''));
	const bodyIndex = regex.lastIndex;
	const body = html.substring(bodyIndex);
	const match1 = regex.exec(html);
	const summary = !match1 ? body : html.substring(bodyIndex, regex.lastIndex - match1[0].length);
	if (summary.length < 1024) {
		return { title, body, summary };
	}
	const elementMatcher = /[^<]*?<([^>\W]*)(?:\W[^=>]+(?:=[^=>]+))*?>(.*?)<\/\1>/g;
	let newSummary = '';
	let match2;
	while((match2 = elementMatcher.exec(summary))) {
		console.log(match2[0].length, newSummary.length, newSummary);
		if (match2[0].length + newSummary.length < 256) {
			newSummary += match2[0];
		} else if (match2[0].length < 1024 && newSummary.length === 0) {
			return { title, body, summary: match2[0] };
		} else if (newSummary.length > 10) {
			return { title, body, summary: newSummary };
		}
	}
	if (newSummary.length > 10) {
		return { title, body, summary: newSummary };
	}
	return { title, body, summary: summary.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 1024) };
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
	};
}

export const {
	homePage,
	perPeriod,
	perTag,
} = makeOverview(content);

export default content;
