import { Post } from './_content';
import { Feed } from 'feed';
import { SITE_URL } from './metadata';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';
import rehypeFixReferencedAssets from './utils/rehypeFixReferencedAssets';

export async function generateFeeds(options: {
	posts: Post[],
	subDirectory: string,
	title: string,
	format: 'atom' | 'rss' | 'json',
	count?: number
}) {
	const feed = new Feed({
		description: '',
		favicon: `${SITE_URL}favicon.ico`,
		feedLinks: { atom: `${SITE_URL}${options.subDirectory}atom.xml`, rss: `${SITE_URL}${options.subDirectory}rss.xml`, json: `${SITE_URL}${options.subDirectory}feed.json`},
		generator: options.title,
		id: SITE_URL,
		link: SITE_URL,
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
			content: (await unified()
				.use(remarkParse)
				.use(remarkRehype)
				.use(rehypeFixReferencedAssets, { filename: post.filename, baseUrl: new URL(`${SITE_URL}${post.mainTag.slug}/${post.slug}`+ (post.childPath ? `/${post.childPath}` : ''))})
				.use(rehypeStringify as any)
				.process(post.markdown)
			).toString(), // TODO parse markdown
			author: [{name: 'Fernando', link: SITE_URL}],
			// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
			image: post.thumbnail?.image!,
			id: `${SITE_URL}${post.mainTag.slug}/${post.slug}`,
			link: `${SITE_URL}${post.mainTag.slug}/${post.slug}`,
			title: post.title,
			category: post.tags.map(e => ({
				name: e.slug,
				scheme: `${SITE_URL}${e.slug}`,
			})),
		});
	}
	switch (options.format) {
	case 'atom':
		return new Response (feed.atom1());
	case 'json':
		return new Response (feed.json1());
	case 'rss':
		return new Response (feed.rss2());
	}
}
