import z from 'zod';
import readEntity from './readEntity';
import { Post } from './types';
import nodeToText from './nodeToText';
import fixFilePath from './fixFilePath';
import execProcess from '@/utils/execProcess';

const POST_META = z.object({
	hiddenFromAll: z.optional(z.boolean()).default(false),
	hiddenFromTags: z.optional(z.boolean()).default(false),
	deprecated: z.optional(z.boolean()).default(false),
	date: z.optional(z.string()),
	thumbnail: z.optional(z.object({
		link: z.optional(z.string()),
		alt: z.optional(z.string()),
		image: z.string(),
		height: z.optional(z.number()),
		width: z.optional(z.number()),
		embed: z.optional(z.enum(['iframe'])),
	}).or(z.string())),
	tags: z.optional(z.array(z.string())).default([]),
	extraTags: z.optional(z.array(z.string())).default([]),
});

async function readBlog(rootDirectoryName: string, blogDirectoryName: string, leafName: null | string): Promise<Omit<Post, 'tags' | 'mainTag'> & { tags: string[] }> {
	try {
		const {
			content,
			data,
			filename,
			tableOfContent,
			tree,
		} = await readEntity(rootDirectoryName + '/' + blogDirectoryName + '/' + (leafName == null ? 'index.md' : leafName + '.md'));
		const {
			date,
			hiddenFromAll,
			hiddenFromTags,
			deprecated,
			tags,
			extraTags,
			thumbnail,
		} = POST_META.parse(data);
		tags.push(...extraTags);
		const index = tags.indexOf(rootDirectoryName);
		if (index != 0) {
			if (index > 0) tags.splice(index, 1);
			tags.unshift(rootDirectoryName);
		}
		if (new Set(tags).size != tags.length) {
			throw new Error('Duplicate tag detected');
		}
		let updatedAtMillis: number = Date.now();
		const gitTime = await execProcess('git', ['log', '-1', '--pretty=format:%at', filename]);
		if (gitTime) updatedAtMillis = Number.parseInt(gitTime + '000');
		const updatedAt = new Date(updatedAtMillis).toISOString();

		const wordCount = nodeToText(tree).split(/\s+/g).length;
		return {
			type: 'post',
			date: date ?? null,
			updatedAt,
			childPath: null,
			filename,
			hiddenFromAll,
			hiddenFromTags,
			markdown: content,
			tags,
			slug: blogDirectoryName,
			deprecated: deprecated,
			title: tableOfContent[0]?.title ?? blogDirectoryName,
			readingTimeMax: Math.max(Math.ceil(wordCount / 200), 1),
			readingTimeMin: Math.max(Math.floor(wordCount / 228), 1),
			tableOfContents: tableOfContent,
			thumbnail:
				typeof thumbnail === 'string' ? {
					image: fixFilePath(filename)(thumbnail),
					alt: null,
					link: null,
					embed: null,
					width: null,
					height: null,
				} :
				typeof thumbnail === 'object' ? {
					image: fixFilePath(filename)(thumbnail.image),
					alt: thumbnail.alt ?? null,
					link: thumbnail.link ?? null,
					embed: thumbnail.embed ?? null,
					width: thumbnail.width ?? null,
					height: thumbnail.height ?? null,
				} :
				null,
		};
	} catch (e) {
		throw new Error('Error parsing '+ rootDirectoryName + '/' + blogDirectoryName, { cause: e});
	}
}

export default readBlog;
