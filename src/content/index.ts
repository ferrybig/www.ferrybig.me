import { DateTime } from 'luxon';
import ContentDefinition from '../types/ContentDefinition';
import findOrCreate from '../utils/findOrCreate';
import paginate from '../utils/paginate';
import sortByKey from '../utils/sortByKey';
import importedTags from './tags';
import blog from './blog';
import career from './career';
import things from './things';
import { parseHtml, EscapedToken, writeHtml } from '../utils/htmlParser';
import { decodeEntities } from '../utils/htmlUtils';
import assertNever from '../utils/assertNever';

function split(html: string, slug: string): Pick<ContentDefinition, 'title' | 'body'> {
	const regex = /<(h[1-6])(?:\W[^=>]+(?:=[^=>]+))*?>(.*?)<\/\1>/mg;
	const match = regex.exec(html);
	if (!match) {
		return { title: slug, body: html};
	}
	const title = decodeEntities(match[2].replace(/<\/?[^>]+(>|$)/g, ''));
	const bodyIndex = regex.lastIndex;
	const body = html.substring(bodyIndex);
	return { title, body };
}

function *transformBody(parent: Generator<EscapedToken, void, unknown>): Generator<EscapedToken, void, unknown> {
	let aOpen = false;
	mainLoop: for (const token of parent) {
		if (token.type === 'tag') {
			switch(token.tag) {
			case 'picture':
			case 'source':
			case 'track':
				continue mainLoop;
			case 'a':
				aOpen = !token.end;
				break;
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'h6':
				token.attr = token.attr.filter(a => a.name !== 'id');
				break;
			case 'img':
				if (token.start) {
					const src = token.attr.find(a => a.name === 'src');
					const alt = token.attr.find(a => a.name === 'alt');
					if (alt && alt.value) {
						if (!aOpen && src) {
							yield {
								type: 'tag',
								start: true,
								end: false,
								tag: 'a',
								attr: [{...src, name: 'href'}],
							};
						}
						yield {
							type: 'text',
							text: alt.value + ' (image)',
						};
						if (!aOpen && src) {
							yield {
								type: 'tag',
								start: false,
								end: true,
								tag: 'a',
								attr: [],
							};
						}
					}
				}
				continue mainLoop;
			}
		}
		yield token;
	}
}

function areWeInABreakableTag(stack: Extract<EscapedToken, {type: 'tag'}>[]) {
	return !!stack.find(e => e.tag === 'p') || !!stack.find(e => e.tag === 'li');
}

function makeSummary(body: string, targetSummaryLength = 512): Pick<ContentDefinition, 'summary' | 'summaryXml' | 'summaryIsShorterThanBody'> {
	let contentLength = 0;
	const tokens: EscapedToken[] = [];
	const stack: Extract<EscapedToken, {type: 'tag'}>[] = [];
	//let lastValidBreakToken = 0;
	let weAreInABreakableTag = true;
	for (const value of transformBody(parseHtml(body))) {
		tokens.push(value);
		switch(value.type) {
		case 'text':
			if (contentLength + value.text.length >= targetSummaryLength && weAreInABreakableTag) {
				tokens.pop();
				const nextSpace = contentLength > targetSummaryLength ? 0 : value.text.indexOf(' ');
				tokens.push({
					type: 'text',
					text: nextSpace >= 0 ? value.text.substring(0, nextSpace) + (nextSpace !== 0 ? '…' : '') : value.text,
				});
				return {
					summary: writeHtml(tokens, { xhtml: false, balance: true }),
					summaryXml: writeHtml(tokens, { xhtml: true, balance: true }),
					summaryIsShorterThanBody: true,
				};
			}
			contentLength += value.text.length;
			break;
		case 'tag':
			if (value.start) {
				stack.push(value);
			}
			if (value.end) {
				stack.pop();
			}
			weAreInABreakableTag = areWeInABreakableTag(stack);
			break;
		case 'comment':
			break;
		default:
			return assertNever(value);
		}
	}
	return {
		summary: writeHtml(tokens, { xhtml: false, balance: true }),
		summaryXml: writeHtml(tokens, { xhtml: true, balance: true }),
		summaryIsShorterThanBody: false,
	};
}


function mdToContentDefinition({default: html, endDate, date, created, updated, hidden, ...rest}: typeof import('*.md')): ContentDefinition {
	// console.log("Splitting: " + html);
	const splitResult = split(html, rest.slug);
	return {
		...rest,
		date: DateTime.fromISO(date),
		endDate: endDate ? DateTime.fromISO(endDate) : null,
		created: created ? DateTime.fromRFC2822(created) : DateTime.now(),
		updated: updated ? DateTime.fromRFC2822(updated) : DateTime.now(),
		hidden: hidden ?? false,
		...splitResult,
		...makeSummary(splitResult.body),
	};
}

const tags: Partial<Record<string, ContentDefinition>> = {};
for (const tag of importedTags) {
	tags[tag.slug] = mdToContentDefinition(tag);
}

const content: ContentDefinition[] = [...blog, ...career, ...things]
	.map(mdToContentDefinition)
	.sort(sortByKey('date', false, sortByKey('created', false)));


export type PaginatedContent = ContentDefinition[][];
export interface TagCloudHit {
	name: string,
	count: number,
	related: Partial<Record<string, number>>,
}
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
	tagCloudHits: TagCloudHit[],
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
		tagCloudHits: perTag.map((t) => ({
			name: t.tag,
			count: t.content.length,
			related: everything
				.filter(e => e.tags.includes(t.tag) || e.extraTags.includes(t.tag))
				.flatMap(e => [...e.tags, ...e.extraTags])
				.filter(e => e !== t.tag)
				.reduce((acc, tag) => {
					acc[tag] = (acc[tag] ?? 0) + 1;
					return acc;
				}, {} as Partial<Record<string, number>>)
		})).sort(sortByKey('count', false))
	};
}

export const {
	homePage,
	perPeriod,
	perTag,
	tagCloudHits,
} = makeOverview(content);

export default content;
