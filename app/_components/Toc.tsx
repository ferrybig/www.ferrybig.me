import { TableOfContentsEntry } from '@/content';
import classes from './Toc.module.css';
import TocLink from './TocLink';
import { CSSProperties, useMemo } from 'react';

interface Leaf {
	index: number,
	depth: number,
	slug: string,
	title: string,
	leafs: Leaf[],
	reduceDepth: number,
}
function renderLeafList(myLeafs: Leaf[], className: string, myReduceDepth: number | null) {
	if (myLeafs.length === 0) return null;
	return (
		<ul className={className} style={myReduceDepth !== null ? { '--reduceDepth': myReduceDepth } as CSSProperties : undefined}>
			{myLeafs.map(({ leafs, slug, title, index, reduceDepth }) => (
				<li key={slug} className={classes.listItem}>
					<TocLink slug={slug} title={title} index={index}/>
					{renderLeafList(leafs, classes.list, reduceDepth)}
				</li>
			))}
		</ul>
	);
}

function countChildrenRecursive(leaf: Leaf): number {
	let count = 0;
	for (const l of leaf.leafs) {
		count += countChildrenRecursive(l);
	}
	return count + leaf.leafs.length;
}

function updateReduceDepth(leaf: Leaf): void {
	for (const l of leaf.leafs) {
		updateReduceDepth(l);
	}
	if (leaf.leafs.length == 0) leaf.reduceDepth = 0;
	else leaf.reduceDepth = countChildrenRecursive(leaf.leafs[leaf.leafs.length - 1]);

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
			reduceDepth: 0,
		};
		const top = stack[stack.length - 1];
		(top ? top.leafs : leafs).push(newEntry);
		stack.push(newEntry);
	}
	for (const leaf of leafs) {
		updateReduceDepth(leaf);
	}
	return leafs;
}

interface Toc {
	entries: TableOfContentsEntry[],
	id?: string | undefined
}
function Toc ({entries, id}: Toc) {
	const leafs = useMemo(() => buildLeafTree(entries), [entries]);
	return (
		<nav id={id} className={classes.root}>
			<h2 className={classes.title}>Table of contents</h2>
			{renderLeafList(leafs, classes.listRoot, null)}
		</nav>
	);
}
export default Toc;
