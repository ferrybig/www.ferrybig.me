import { Feed } from 'feed';
import { SITE_URL } from '../metadata';
import { MetaData } from '@/content';
import face from '@assets/face.png';
import favicon32x32 from '@assets/favicon-32x32.png';

export async function generateFeeds(options: {
	posts: MetaData[],
	subDirectory: string,
	title: string,
	format: 'atom' | 'rss' | 'json',
	count?: number
}) {
	const feed = new Feed({
		description: '',
		favicon: new URL(favicon32x32.src.replace(/\.png$/, '.avif'), SITE_URL).href,
		feedLinks: {
			atom: new URL(`${options.subDirectory}/feed.atom.xml`, SITE_URL).href,
			rss: new URL(`${options.subDirectory}/feed.rss.xml`, SITE_URL).href,
			json: new URL(`${options.subDirectory}/feed.json`, SITE_URL).href,
		},
		generator: options.title,
		id: new URL(`${options.subDirectory}`, SITE_URL).href,
		link: new URL(`${options.subDirectory}`, SITE_URL).href,
		title: options.title,
		copyright: '',
		language: 'en',
		author: {
			name: 'Fernando',
			link: SITE_URL,
		},
	});

	const maxPosts = (options.count ?? 15);
	let count = 0;
	for (let i = options.posts.length - 1; i >= 0; i--) {
		const post = options.posts[i];
		if (!post.date) continue;
		if (count++ >= maxPosts) break;
		feed.addItem({
			date: new Date(post.date),
			// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
			image: post.thumbnail ? new URL(post.thumbnail.image.src, SITE_URL).href : '',
			id: new URL(post.slug, SITE_URL).href,
			link: new URL(post.slug, SITE_URL).href,
			title: post.title,
			content: post.summary ?? undefined!,
			category: post.tags.map(e => ({
				name: e,
				scheme: `${SITE_URL}${e}`,
			})),
		});
	}
	switch (options.format) {
	case 'atom':
		return new Response (feed.atom1(), {headers: {'Content-Type': 'application/atom+xml'}});
	case 'json':
		return new Response (feed.json1(), {headers: {'Content-Type': 'application/json'}});
	case 'rss':
		return new Response (feed.rss2(), {headers: {'Content-Type': 'application/rss+xml'}});
	}
}
