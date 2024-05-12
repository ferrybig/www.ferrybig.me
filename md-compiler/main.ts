#!/usr/bin/env node
import markdownCompiler from './parser/start.js';

try {
	await markdownCompiler({
		inputDir: '../content',
		outputDir: '../app',
		articleWrapperPath: '../app/_components/ArticleWrapper',
		miniumForFeedGeneration: 1,
		defaultCommentStatus: 'open',
		doClean: false,
		doCompile: true,
		doWatch: false,
	});
} catch (e) {
	console.error('An error happened',e);
}
