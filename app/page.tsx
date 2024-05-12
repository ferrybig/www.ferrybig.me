import Link from 'next/link';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
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
