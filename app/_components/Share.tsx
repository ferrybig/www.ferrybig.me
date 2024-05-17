'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MouseEvent, ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';

const ShareDialog = dynamic(() => import('./ShareDialog'), { ssr: false });

interface Share {
	slug: string
}
function Share({ slug }: Share) {
	const [jsx, setJsx] = useState<ReactNode>(undefined);
	function sharePage(e: MouseEvent) {
		e.preventDefault();
		const shareAble = {
			title: document.title,
			url: document.location.href,
		};
		if (!e.shiftKey && navigator.canShare && navigator.canShare(shareAble)) {
			navigator.share(shareAble);
		} else {
			setJsx(<ShareDialog
				href={document.location.href}
				title={document.title}
				onClose={() => setJsx(undefined)}
			/>);
		}
	}
	return (
		<>
			<Link href={slug} onClick={sharePage} >
				Share
			</Link>
			{jsx && createPortal(jsx, document.body)}
		</>
	);
}
export default Share;
