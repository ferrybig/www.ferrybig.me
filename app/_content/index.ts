import { readdir } from 'fs/promises';
import sortByKey from '../utils/sortByKey';
import { BASE_DIR } from '@/metadata';
import readPartialTag from './readTag';
import readBlog from './readPost';
import { Content, Post, Tag } from './types';
import { Dirent } from 'fs';

export * from './types';


async function readLeafDirectories(top: Dirent, middle: Dirent): Promise<Dirent[][]> {
	const entries: Dirent[][] = [];
	for (const entry of await readdir(BASE_DIR + top.name + '/' + middle.name, { withFileTypes: true })) {
		if (entry.name.endsWith('.md')) {
			entries.push([top, middle, entry]);
		}
	}
	return entries;
}
async function readMiddleDirectories(top: Dirent): Promise<Dirent[][]> {
	const entries: Promise<Dirent[][]>[] = [];
	for (const entry of await readdir(BASE_DIR + top.name, { withFileTypes: true })) {
		if (!entry.isDirectory()) {
			if (entry.name === 'index.md')
				entries.push(Promise.resolve([[top, entry]]));
			continue;
		}
		entries.push(readLeafDirectories(top, entry));
	}
	return (await Promise.all(entries)).flatMap(e => e);
}
async function readRootEntries(): Promise<Dirent[][]> {
	const entries: Promise<Dirent[][]>[] = [];
	for (const entry of await readdir(BASE_DIR, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		entries.push(readMiddleDirectories(entry));
	}
	return (await Promise.all(entries)).flatMap(e => e);
}

async function readThings(): Promise<(Awaited<ReturnType<typeof readPartialTag>> | Awaited<ReturnType<typeof readBlog>>)[]> {
	return Promise.all((await readRootEntries()).map(([root, middle, leaf]) => {
		if (middle.name === 'index.md') {
			return readPartialTag(root.name);
		}

		if (leaf.name === 'index.md') {
			return readBlog(root.name, middle.name, null);
		}
		return readBlog(root.name, middle.name, leaf.name);
	}));
}


const content = (async (): Promise<Content> => {
	const entries = await readThings();
	const tagMap: Record<string, Tag> = Object.create(null);
	const rawPosts: Post[] = [];
	for (const thing of entries) {
		if (thing.type === 'tag') {
			const oldTag = tagMap[thing.slug];
			const newTag = tagMap[thing.slug] = {
				...thing,
				posts: oldTag?.posts ?? [],
			};
			if (oldTag) {
				for (const post of rawPosts) {
					for (let i = 0; i < post.tags.length; i++) {
						if (post.tags[i] == oldTag) post.tags[i] = newTag;
					}
				}
			}
			continue;
		}
		const post = thing;
		const tags: Tag[] = [];
		let mainTag: Tag | null = null;
		for (const tag of post.tags) {
			const tagInstance = tagMap[tag] ??= {
				type: 'tag',
				filename: tag + '/index.md',
				hidden: false,
				layout: 'list',
				markdown: '',
				slug: tag,
				title: tag,
				posts: [],
				topicIndex: 0,
			};
			tags.push(tagInstance);
			if (mainTag === null) mainTag = tagInstance;
		}
		if (!mainTag) {
			throw new Error('Post ' + post.filename + ' is missing a main tag');
		}
		const generatedPost: Post = {
			...post,
			tags,
			mainTag,
		};
		if (!post.hiddenFromTags) for (const tag of tags) tag.posts.push(generatedPost);
		rawPosts.push(generatedPost);
	}

	const rawTags = Object.values(tagMap);

	sortByKey(rawPosts, 'title');
	sortByKey(rawPosts, 'date');
	sortByKey(rawTags, 'title');
	for (const tag of rawTags) {
		sortByKey(tag.posts, 'title');
		sortByKey(tag.posts, 'date');
	}
	return {
		rawPosts,
		posts: rawPosts.filter(e => !e.hiddenFromAll),
		rawTags,
		tags: rawTags.filter(e => !e.hidden),
	};
})();
export default content;

function throwError(message: string): never {
	throw new Error(message);
}

export async function visibleTags() {
	return (await content).tags;
}
export async function allTags() {
	return (await content).rawTags;
}
export async function findTag(tagName: string) {
	return (await content).rawTags.find(e => e.slug === tagName) ?? throwError('Tag ' + tagName + ' not found');
}
export async function visiblePosts() {
	return (await content).posts;
}
export async function allPosts() {
	return (await content).rawPosts;
}
export async function allTopLevelPosts() {
	return (await content).rawPosts.filter(e => !e.childPath);
}
export async function allChildrenPosts() {
	return (await content).rawPosts.filter(e => e.childPath);
}
export async function findPost(tagName: string, postName: string, leafName: string | null) {
	return (await content).rawPosts.find(e => e.mainTag.slug === tagName && e.slug === postName && e.childPath === leafName) ??
		throwError('Post ' + tagName + ' not found');
}
