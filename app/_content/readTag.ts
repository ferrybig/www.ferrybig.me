import { z } from 'zod';
import readBase from './readEntity';
import { Tag } from './types';

const TAG_META = z.object({
	hidden: z.optional(z.boolean()).default(false),
	topicIndex: z.optional(z.number()).default(0),
	layout: z.optional(z.enum(['list', 'card', 'simple', 'none'])).default('list'),
	thumbnail: z.optional(z.object({
		link: z.optional(z.string()),
		alt: z.optional(z.string()),
		image: z.string(),
		height: z.optional(z.number()),
		width: z.optional(z.number()),
	}).or(z.string())),
});

async function readPartialTag(tagName: string): Promise<Omit<Tag, 'posts' | 'minDate' | 'maxDate'>> {
	const {
		content,
		data,
		filename,
		tableOfContent,
	} = await readBase(tagName + '/index.md');
	const {
		layout,
		hidden,
		topicIndex,
	} = TAG_META.parse(data);
	return {
		type: 'tag',
		filename,
		hidden,
		layout,
		slug: tagName,
		markdown: content,
		title: tableOfContent[0]?.title || tagName,
		topicIndex,
	};
}

export default readPartialTag;
