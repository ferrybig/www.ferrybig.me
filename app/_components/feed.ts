import { Feed } from 'feed';
import { SITE_URL } from '../metadata';
import { MetaData } from '@/content';

export async function generateFeeds(options: {
	posts: MetaData[],
	subDirectory: string,
	title: string,
	format: 'atom' | 'rss' | 'json',
	count?: number
}) {
	const feed = new Feed({
		description: '',
		favicon: `${SITE_URL}favicon.ico`,
		feedLinks: { atom: `${SITE_URL}${options.subDirectory}/feed.atom.xml`, rss: `${SITE_URL}${options.subDirectory}/feed.rss.xml`, json: `${SITE_URL}${options.subDirectory}/feed.json`},
		generator: options.title,
		id: SITE_URL + options.subDirectory,
		link: SITE_URL + options.subDirectory,
		title: options.title,
		copyright: '',
		language: 'en',
	});

	const maxPosts = (options.count ?? 15);
	let count = 0;
	for (let i = options.posts.length - 1; i >= 0; i--) {
		const post = options.posts[i];
		if (!post.date) continue;
		if (count++ >= maxPosts) break;
		feed.addItem({
			date: new Date(post.date),
			author: [{name: 'Fernando', link: SITE_URL}],
			// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
			image: post.thumbnail ? new URL(post.thumbnail.image.src, SITE_URL).href : '',
			id: `${SITE_URL}${post.slug}`,
			link: `${SITE_URL}${post.slug}`,
			title: post.title,
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
