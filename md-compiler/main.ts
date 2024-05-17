#!/usr/bin/env node
import markdownCompiler from './parser/start.js';

try {
	await markdownCompiler({
		inputDir: '../content',
		outputDir: '../app',
		articleWrapperPath: '../app/_components/ArticleWrapper',
		miniumForFeedGeneration: 1,
		defaultCommentStatus: 'open',
		doClean: process.argv.includes('clear'),
		doCompile: true,
		doWatch: process.argv.includes('watch'),
	});
} catch (e) {
	console.error('An error happened',e);
	process.exit(1);
}
