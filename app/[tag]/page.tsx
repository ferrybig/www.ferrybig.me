import { allTags, findTag } from '@/_content';
import Link from 'next/link';

export default async function Home({params}: { params: Awaited<ReturnType<typeof generateStaticParams>>[number] }) {
	const tag = await findTag(params.tag);
	return (
		<div>
			<ul>
				{tag.posts.map(e => e.hiddenFromTags ? null : (
					<li key={e.slug + (e.childPath ? '/' + e.childPath : '')}>
						<Link href={tag.slug + '/' + e.slug + (e.childPath ? '/' + e.childPath : '')}>
							{e.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
		//<pre>{JSON.stringify(tag, (key, value) => key === 'tags' || key === 'mainTag' ? '...' : value, 4)}</pre>
	);
}

export async function generateStaticParams() {
	return (await allTags()).map((tag) => ({
		tag: tag.slug,
	}));
}
