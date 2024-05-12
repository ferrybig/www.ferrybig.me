import type { MetaData } from './typesExport.js';

export interface CompileResultsArticle {
	type: 'article'
	file: string
	contents: string
	metadata: MetaData
	needsFeeds: boolean
}
export interface CompileResultsFile {
	type: 'file'
	file: string
	contents: string
}

export interface CompileResultsSubTasks {
	type: 'sub-tasks'
	children: (CompileResults | Promise<CompileResults>)[],
}

export type CompileResults = CompileResultsArticle | CompileResultsSubTasks | CompileResultsFile

export interface Config {
	readonly inputDir: string
	readonly outputDir: string
	readonly articleWrapperPath: string
	readonly miniumForFeedGeneration: number
	readonly defaultCommentStatus: MetaData['commentStatus']
}
export interface CompileConfig extends Config {
	readonly doClean: boolean
	readonly doCompile: boolean
	readonly doWatch: boolean
}
