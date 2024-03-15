'use client';

import { useEffect, useSyncExternalStore } from 'react';
import classes from './TocLink.module.css';

const intersectedEntities: number[] = [];
const listeners: (() => void)[] = [];
function onStoreUpdate(cb: () => void): () => void {
	listeners.push(cb);
	return () => {
		const index = listeners.indexOf(cb);
		if (index >= 0) listeners.splice(index, 1);
	};
}
function checkLastIsSlug(linkIndex: number) {
	return intersectedEntities[intersectedEntities.length - 1] === linkIndex;
}
function updateIntersectionState(linkIndex: number, state: boolean) {
	const index = intersectedEntities.indexOf(linkIndex);
	if (index < 0 && state) {
		const newIndex = intersectedEntities.findIndex(e => e > linkIndex);
		intersectedEntities.splice(newIndex < 0 ? intersectedEntities.length : newIndex, 0, linkIndex);
		for (const listener of listeners) listener();
	}
	if (index >= 0 && !state) {
		intersectedEntities.splice(index, 1);
		for (const listener of listeners) listener();
	}
	console.log(linkIndex, state, [...intersectedEntities]);
}

interface TocLink {
	slug: string,
	title: string,
	index: number,
}
function TocLink({ slug, title, index }: TocLink) {
	const visible = useSyncExternalStore(onStoreUpdate, () => checkLastIsSlug(index), () => false);
	useEffect(() => {
		const element = document.querySelector(`#${slug}`)?.parentElement;
		if (!element) return;

		const observer = new IntersectionObserver(([{isIntersecting}]) => {
			updateIntersectionState(index, isIntersecting);
		}, {
			rootMargin: '16px 0px -99% 0px',
			threshold: 0,
		} );
		observer.observe(element);
		return () => {
			observer.disconnect();
		};
	});
	return (
		<a href={`#${slug}`} className={visible ? classes.linkActive : classes.link} title={title}>{title}</a>
	);
}
export default TocLink;
