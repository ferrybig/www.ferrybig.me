import { join } from 'node:path';
import type { CompileResults, CompileResultsArticle, CompileResultsSubTasks, Config } from '../types.js';
import makeGeneratedPage from './makeGeneratedPage.js';

export default function makeMissingTags(results: Exclude<CompileResults, CompileResultsSubTasks>[], config: Config): CompileResultsArticle[] {
	const newTags = new Map<string, CompileResultsArticle | null>();
	for (const result of results) {
		if (result.type !== 'article') continue;
		newTags.set(result.metadata.slug, null);
		for (const tag of result.metadata.tags) {
			if (!newTags.has(tag)) {
				const outputPath = join(tag, 'page.js');
				const parent = tag.split('/').slice(0, -1).join('/');
				newTags.set(tag, {
					type: 'article',
					contents: makeGeneratedPage(null, [], tag, `${tag}/index.md`, config),
					metadata: {
						slug: tag,
						date: null,
						color: null,
						icon: null,
						deprecated: false,
						commentStatus: config.defaultCommentStatus,
						tags: parent ? [parent] : [],
						readingTimeMax: 0,
						readingTimeMin: 0,
						thumbnail: null,
						excludeFromAll: false,
						excludeFromChildren: false,
						childrenLayout: 'list',
						title: tag,
						updatedAt: null,
						topicIndex: null,
					},
					file: outputPath,
					needsFeeds: false,
				});
			}
		}
	}
	return [...newTags.values()].filter((x): x is CompileResultsArticle => x !== null);
}
