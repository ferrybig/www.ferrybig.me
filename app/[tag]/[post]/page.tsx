import { Metadata } from 'next/types';
import { allPosts, findPost } from '@/_content';
import Article from '@/_components/Article';

export async function generateMetadata({ params }: { params: Awaited<ReturnType<typeof generateStaticParams>>[number] }): Promise<Metadata> {
	const post = await findPost(params.tag, params.post, null);
	return {
		title: post.title,
		keywords: post.tags.map(e => e.slug),
		openGraph: {
			type: 'article',
			tags: post.tags.map(e => e.slug),
			images: post.thumbnail ? [post.mainTag.slug + '/' + post.slug + '/' + post.thumbnail.image] : [],
		},
	};
}

export default async function Home({params}: { params: Awaited<ReturnType<typeof generateStaticParams>>[number] }) {
	const post = await findPost(params.tag, params.post, null);
	return (
		<Article post={post}/>
	);
}

export async function generateStaticParams() {
	return (await allPosts()).filter(e => !e.childPath).map(p => ({
		post: p.slug,
		tag: p.mainTag.slug,
	}));
}
