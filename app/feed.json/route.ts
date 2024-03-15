import content from '@/_content';
import { generateFeeds } from '@/feed';

export async function GET(): Promise<Response> {
	const {rawPosts: posts} = await content;
	const output = generateFeeds({
		format: 'json',
		posts: posts.filter(e => !e.hiddenFromAll),
		subDirectory: '',
		title: 'All posts on ferrybig.me',
	});
	return output;
}
