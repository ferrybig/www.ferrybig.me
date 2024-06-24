import type { MetaData } from './typesExport.js';
import type { Cache } from './utils/cache.js';

export interface CompileResultsArticle {
	readonly type: 'article'
	readonly file: string
	readonly contents: string
	readonly metadata: MetaData
	readonly needsFeeds: boolean
}
export interface CompileResultsFile {
	readonly type: 'file'
	readonly file: string
	readonly contents: string
}

export interface CompileResultsSubTasks {
	readonly type: 'sub-tasks'
	readonly children: (CompileResults | Promise<CompileResults>)[],
}

export type CompileResults = CompileResultsArticle | CompileResultsSubTasks | CompileResultsFile

export interface Config {
	readonly inputDir: string
	readonly outputDir: string
	readonly articleWrapperPath: string
	readonly miniumForFeedGeneration: number
	readonly defaultCommentStatus: MetaData['commentStatus']
}
export interface RunningConfig extends Config {
	readonly cache: Cache;
}

export interface CompileConfig extends Config {
	readonly doClean: boolean
	readonly doCompile: boolean
	readonly doWatch: boolean
}
