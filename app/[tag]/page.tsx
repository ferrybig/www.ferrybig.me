import { allTags, findTag } from '@/_content';

export default async function Home({params}: { params: Awaited<ReturnType<typeof generateStaticParams>>[number] }) {
	const tag = await findTag(params.tag);
	return (
		<pre>{JSON.stringify(tag, (key, value) => key === 'tags' || key === 'mainTag' ? '...' : value, 4)}</pre>
	);
}

export async function generateStaticParams() {
	return (await allTags()).map((tag) => ({
		tag: tag.slug,
	}));
}
