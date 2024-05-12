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
				contents: `import { StaticImageData } from 'next/image';
${(await readFile(join(import.meta.dirname, '../../typesExport.ts'), 'utf8'))
		.replace('readonly image: string', 'readonly image: StaticImageData')
		.replace('readonly icon: string | null', 'readonly icon: StaticImageData | null')
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
