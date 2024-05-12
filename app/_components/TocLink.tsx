'use client';

import { useEffect, useSyncExternalStore } from 'react';
import classes from './TocLink.module.css';

const intersectedEntitiesListeners: (() => void)[] = [];
function onStoreUpdate(cb: () => void): () => void {
	intersectedEntitiesListeners.push(cb);
	return () => {
		const index = intersectedEntitiesListeners.indexOf(cb);
		if (index >= 0) intersectedEntitiesListeners.splice(index, 1);
	};
}
/**
 * Ordered list of sections that are are currently intersecting, note that this list must be kept sorted.
 * A linked list would yield better performance, but the size of the dataset is tiny.
 */
const intersectedEntities: number[] = [];
function checkLastIsSlug(linkIndex: number) {
	return intersectedEntities[intersectedEntities.length - 1] === linkIndex;
}
let observer: IntersectionObserver | null = null;
const elementToIndexMap = new WeakMap<Element, (isIntersecting: boolean) => void>();
function observeParent(slug: string, index: number) {
	const element = document.getElementById(slug)?.parentElement;
	if (!element) return;
	if (observer == null) {
		observer = new IntersectionObserver((entries) => {
			for (const {target, isIntersecting} of entries) {
				elementToIndexMap.get(target)?.(isIntersecting);
			}
		}, {
			rootMargin: '16px 0px -99% 0px',
			threshold: 0,
		});
	}
	elementToIndexMap.set(element, (isIntersecting) => {
		const entryIndex = intersectedEntities.indexOf(index);
		if (entryIndex < 0 && isIntersecting) {
			// Use insertion sort to add the new entry into the list
			const newIndex = intersectedEntities.findIndex(e => e > index);
			intersectedEntities.splice(newIndex < 0 ? intersectedEntities.length : newIndex, 0, index);
			for (const listener of intersectedEntitiesListeners) listener();
		}
		if (entryIndex >= 0 && !isIntersecting) {
			intersectedEntities.splice(entryIndex, 1);
			for (const listener of intersectedEntitiesListeners) listener();
		}
	});
	observer.observe(element);
	return () => {
		observer!.unobserve(element);
		elementToIndexMap.delete(element);
	};
}
function useTocItemIntersectionListener(slug: string, index: number) {
	useEffect(() => {
		return observeParent(slug, index);
	}, [slug, index]);
	return useSyncExternalStore(onStoreUpdate, () => checkLastIsSlug(index), () => false);
}

interface TocLink {
	slug: string,
	title: string,
	index: number,
}
function TocLink({ slug, title, index }: TocLink) {
	const visible = useTocItemIntersectionListener(slug, index);
	return (
		<a href={`#${slug}`} className={visible ? classes.linkActive : classes.link} title={title}>{title}</a>
	);
}
export default TocLink;
