import { join } from 'node:path/posix';
import type { RunningConfig } from '../types.js';
import importRelative from './importRelative.js';
import type { TableOfContentsEntry } from '../typesExport.js';

export default function makeGeneratedPage(compiledMarkdown: string | null, tableOfContents: TableOfContentsEntry[], slug: string, originalFile: string | null, {articleWrapperPath, outputDir}: RunningConfig) {
	return `/* eslint-disable */
import ArticleWrapper, { generateMetadata as _generateMetadata } from ${JSON.stringify(importRelative(join(outputDir, slug), articleWrapperPath))};
import { getMetadata, getChildren, hasFeeds, getIdBySlug } from ${JSON.stringify(importRelative(join(slug), 'content'))};
import { createElement } from "react";
${compiledMarkdown ?? ''}
const slug = ${JSON.stringify(slug)};
const toc = ${JSON.stringify(tableOfContents)};
const originalFile = ${JSON.stringify(originalFile)};
const id = getIdBySlug(slug);
const metadata = getMetadata(id);
const children = getChildren(id);
const feeds = hasFeeds(id);

const props = {
	id,
	slug,
	originalFile,
	toc,
	metadata,
	children,
	feeds,
	factory: ${compiledMarkdown ? '_createMdxContent' : 'null'},
};
const jsx = createElement(ArticleWrapper, props);

export function generateMetadata() {
	return _generateMetadata(props);
}
export default function GeneratedPage() {
	return jsx
}
export const dynamic = "force-static"
`;
}

export function makeGeneratedFeed(format: string, slug: string | null, {articleWrapperPath, outputDir}: RunningConfig) {
	return `/* eslint-disable */
import { generateFeed } from ${JSON.stringify(importRelative(join(outputDir, slug ?? '.', 'feed'), articleWrapperPath))};
import { ${slug ? 'getChildrenBySlug, getMetadataBySlug' : 'getContentChildren'} } from ${JSON.stringify(importRelative(join(slug ?? '.', 'feed'), 'content'))};
${slug ?
		`const slug = ${JSON.stringify(slug)}, metadata = getMetadataBySlug(slug), children = getChildrenBySlug(slug);` :
		'const metadata = null, children = getContentChildren();'
}

export function GET() {
	return generateFeed(metadata, children, ${JSON.stringify(format)});
}
export const dynamic = "force-static"
`;
}
