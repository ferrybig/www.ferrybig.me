import { readFile } from 'node:fs/promises';
import type { CompileResultsSubTasks } from '../types.js';
import { join } from 'node:path';

export default async function generateStaticFiles(): Promise<CompileResultsSubTasks> {
	return {
		type: 'sub-tasks',
		children: [
			{
				type: 'file',
				file: 'content.d.ts',
				contents: `import type { StaticImageData } from 'next/image';
import type { ComponentType, ReactElement } from 'react';

export interface TableOfContentsEntry {
	readonly title: string,
	readonly slug: string,
	readonly lvl: number,
}

export interface MetaData {
	readonly slug: string,
	readonly date: string | null,
	readonly color: string | null,
	readonly icon: StaticImageData | null,
	readonly updatedAt: string | null,
	readonly topicIndex: number | null,
	readonly tags: string[],
	readonly title: string,
	readonly childrenLayout: 'card' | 'list' | null,
	readonly deprecated: boolean,
	readonly commentStatus: 'open' | 'closed' | 'disabled',
	readonly children: 'auto' | 'direct' | 'indirect',
	readonly linkTitle: string,
	readonly summary: string | null,
	readonly excludeFromAll: boolean,
	readonly excludeFromChildren: boolean,
	readonly readingTimeMin: number,
	readonly readingTimeMax: number,
	readonly thumbnail: {
		readonly alt: string | null,
		readonly link: string | null,
		readonly width: number | null,
		readonly height: number | null,
		readonly image: StaticImageData,
		readonly embed: string | null,
	} | null,
}
export interface ArticleWrapperProps {
	slug: string,
	id: number,
	metadata: MetaData,
	children: MetaData[],
	feeds: boolean,
	toc: TableOfContentsEntry[],
	originalFile: string | null
	factory: null | ((props: { components: Record<string, ComponentType<any>> }) => ReactElement),
}

export declare function getIdBySlug(slug: string): number;
export declare function getChildren(id: number): MetaData[];
export declare function getChildrenBySlug(slug: string): MetaData[];
export declare function getMetadata(id: number): MetaData;
export declare function getMetadataBySlug(slug: string): MetaData;
export declare function hasFeeds(id: number): boolean;
export declare function hasFeedsBySlug(slug: string): boolean;
export declare function getDirectChildren(): MetaData[];
export declare function getIndirectChildren(): MetaData[];
export declare function getTopicChildren(): MetaData[];
export declare function getAllPosts(): readonly MetaData[];
`,
			},
			{
				type: 'file',
				file: 'comments.json/route.js',
				contents: `import { getAllPosts } from '../content';
export function GET() {
	return new Response (
		JSON.stringify(getAllPosts().filter(({ commentStatus }) => commentStatus !== 'disabled').map(({ slug, commentStatus }) => ({ url: slug, status: commentStatus }))),
		{headers: {'Content-Type': 'application/json'}}
	);
}
`,
			},
		],
	};
}
