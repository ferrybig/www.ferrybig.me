import { dirname } from 'node:path';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkSmartypants from 'remark-smartypants';
import rehypeSlug from 'rehype-slug';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import setImageSize from '../plugins/rehypeImageSize.js';
import { remarkMdxEvalCodeBlock } from '../plugins/remarkMdxEvalCodeBlock.js';
import section from '@hbsnow/rehype-sectionize';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeMdxAssets from '../plugins/rehypeMdxAssets.js';

export async function compileMdx(inputFileName: string, outputFileName: string, content: string): Promise<string> {

	const vFile = await compile(
		content,
		{
			remarkPlugins: [
				[remarkMdxEvalCodeBlock],
				[remarkGfm],
				[remarkSmartypants as any],
			],
			rehypePlugins: [
				[setImageSize, { dir: dirname(inputFileName) }],
				[rehypeMdxAssets, { inputFileName, outputFileName}],
				[rehypePrettyCode as any, { theme: {
					dark: 'github-dark-dimmed',
					light: 'github-light',
				} }],
				[rehypeSlug],
				[rehypeAutolinkHeadings, {
					content: [],
					properties: { class: '', ariaHidden: true, tabIndex: -1 },
					headingProperties: { class: '' },
				}],
				[section as any, { properties: { className: undefined } }],
				[rehypeAccessibleEmojis],
				[rehypeMinifyWhitespace],
			//[rehypeTruncate, { maxChars: 200, disable: !truncated }],
			],
		},
	);
	const generatedCodeWithDefaultExport = String(vFile);
	const needle = 'export default function MDXContent';
	const exportDefaultIndex = generatedCodeWithDefaultExport.lastIndexOf(needle);
	if (exportDefaultIndex < 0) throw new Error('Trouble with file generation');
	const generatedCode = generatedCodeWithDefaultExport.substring(0, exportDefaultIndex).trimEnd();
	return generatedCode;
}
