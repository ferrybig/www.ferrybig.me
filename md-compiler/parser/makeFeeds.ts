import type { CompileResults, CompileResultsFile, CompileResultsSubTasks, Config } from '../types.js';
import { makeGeneratedFeed } from './makeGeneratedPage.js';

export default function makeFeeds(
	results: Exclude<CompileResults, CompileResultsSubTasks>[],
	config: Config,
): CompileResultsFile[] {
	const newFiles: CompileResultsFile[] = [];
	let seenIndex = false;
	for (const result of results) {
		if (result.type === 'article' && result.needsFeeds) {
			seenIndex ||= result.metadata.slug === '';
			newFiles.push(
				{
					type: 'file',
					file: result.file.slice(0, -'page.js'.length) + 'feed.json/route.js',
					contents: makeGeneratedFeed('json', result.metadata.slug, config),
				},
				{
					type: 'file',
					file: result.file.slice(0, -'page.js'.length) + 'feed.atom.xml/route.js',
					contents: makeGeneratedFeed('atom', result.metadata.slug, config),
				},
				{
					type: 'file',
					file: result.file.slice(0, -'page.js'.length) + 'feed.rss.xml/route.js',
					contents: makeGeneratedFeed('rss', result.metadata.slug, config),
				},
			);
		}
	}
	if (!seenIndex) {
		newFiles.push(
			{
				type: 'file',
				file: 'feed.json/route.js',
				contents: makeGeneratedFeed('json', null, config),
			},
			{
				type: 'file',
				file: 'feed.atom.xml/route.js',
				contents: makeGeneratedFeed('atom', null, config),
			},
			{
				type: 'file',
				file: 'feed.rss.xml/route.js',
				contents: makeGeneratedFeed('rss', null, config),
			},
		);
	}
	return newFiles;
}
