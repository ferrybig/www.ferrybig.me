import Link from 'next/link';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
	metadataBase: new URL('https://ferrybig.me'),
	title: 'Ferrybig.me',
	authors: [
		{
			name: 'Fernando',
			url: 'https://ferrybig.me',
		},
	],
	formatDetection: {
		address: false,
		date: false,
		email: false,
		telephone: false,
		url: false,
	},
	alternates: {
		canonical: '/',
		types: {
			'application/rss+xml': 'rss.xml',
			'application/atom+xml': 'atom.xml',
			'application/feed+json': 'feed.json',
		},
	},
};

export default function Home() {
	return (
		<>
			<h1>Home</h1>
			<Link href="/tech/exploring-the-details-html-element">
				example Link
			</Link>
		</>
	);
}
