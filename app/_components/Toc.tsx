import { TableOfContentsEntry } from '@/_content';
import classes from './Toc.module.css';
import TocLink from './TocLink';
import { CSSProperties } from 'react';

interface Leaf {
	index: number,
	depth: number,
	slug: string,
	title: string,
	leafs: Leaf[],
	reduceLength: number,
}
function renderLeafList(leafs: Leaf[], className: string) {
	if (leafs.length === 0) return null;
	return (
		<ul className={className}>
			{/* eslint-disable-next-line @typescript-eslint/no-use-before-define, react/forbid-component-props */}
			{leafs.map(l => <Leaf {...l} key={l.slug}/>)}
		</ul>
	);
}
function Leaf({leafs, slug, title, reduceLength, index}: Leaf) {
	return (
		<li style={leafs.length > 0 ? { '--reduceDepth': reduceLength } as CSSProperties : undefined}>
			<TocLink slug={slug} title={title} index={index}/>
			{renderLeafList(leafs, classes.list)}
		</li>
	);
}

function updateDeduceDepth(leaf: Leaf): number {
	let lastReduceLength: number | null = null;
	for (const l of leaf.leafs) {
		lastReduceLength = updateDeduceDepth(l);
	}
	if (lastReduceLength == null) {
		return 0;
	}
	leaf.reduceLength = lastReduceLength;
	return lastReduceLength + leaf.leafs.length;

}

function buildLeafTree(entries: TableOfContentsEntry[]): Leaf[] {
	const leafs: Leaf[] = [];
	const stack: Leaf[] = [];
	for (let i = 0; i < entries.length; i++) {
		const entry = entries[i];
		while (stack.length !== 0 && stack[stack.length - 1].depth >= entry.lvl) {
			stack.pop();
		}
		const newEntry: Leaf = {
			index: i,
			depth: entry.lvl,
			leafs: [],
			slug: entry.slug,
			title: entry.title,
			reduceLength: 0,
		};
		const top = stack[stack.length - 1];
		(top ? top.leafs : leafs).push(newEntry);
		stack.push(newEntry);
	}
	for (const leaf of leafs) {
		updateDeduceDepth(leaf);
	}
	return leafs;
}

interface Toc {
	entries: TableOfContentsEntry[],
	id?: string | undefined
}
function Toc ({entries, id}: Toc) {
	const leafs = buildLeafTree(entries);
	return (
		<nav id={id}>
			<h2 className={classes.title}>In this article</h2>
			{renderLeafList(leafs, classes.listRoot)}
		</nav>
	);
}
export default Toc;
