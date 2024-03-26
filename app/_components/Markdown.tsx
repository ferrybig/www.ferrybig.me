
import { MDXRemote } from 'next-mdx-remote/rsc';
import { dirname } from 'path';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkSmartypants from 'remark-smartypants';
import rehypeSlug from 'rehype-slug';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import setImageSize from '@/utils/rehypeImageSize';
import { remarkMdxEvalCodeBlock } from '@/utils/remarkMdxEvalCodeBlock';
import section from '@hbsnow/rehype-sectionize';
import rehypeFixReferencedAssets from '@/utils/rehypeFixReferencedAssets';
import rehypeDownloadAttribute from '@/utils/rehypeDownloadAttribute';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeTruncate from 'rehype-truncate';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import isRelative from '@/utils/isRelative';
import HtmlPreview from './HtmlPreview';
import Image from 'next/image';
import Link from 'next/link';
import classes from './Markdown.module.css';
import { ReactNode } from 'react';

// https://rehype-pretty-code.netlify.app/

interface Markdown {
	source: string
	filename: string
	truncated?: boolean | undefined
	beforeHeading?: ReactNode,
}
function Markdown({ source, filename, truncated, beforeHeading }: Markdown) {
	return (
		<div className={classes.markdown}>
			<MDXRemote
				source={source}
				components={{
					h1: (props) => (
						<>
							{beforeHeading}
							<h1 {...props}/>
						</>
					),
					HtmlPreview,
					img: (props) => <Image
						style={{ color: undefined }}
						{...props}
						src={props.src ?? ''}
						alt={props.alt ?? ''}
						width={props.width ? Number(props.width) : undefined}
						height={props.height ? Number(props.height) : undefined}
					/>,
					a: (props) => props.href && isRelative(props.href) ? <Link {...props as any} href={props.href ?? ''}/> : <a {...props}/>,
				}}
				options={{
					mdxOptions: {
						remarkPlugins: [
							[remarkMdxEvalCodeBlock],
							[remarkGfm],
							[remarkSmartypants as any],
						],
						rehypePlugins: [
							[setImageSize, { dir: dirname(filename) }],
							[rehypeFixReferencedAssets, { filename}],
							[rehypePrettyCode as any, { theme: {
								dark: 'github-dark-dimmed',
								light: 'github-light',
							} }],
							[rehypeSlug],
							[rehypeAutolinkHeadings, {
								content: [],
								properties: { class: classes.link, ariaHidden: true, tabIndex: -1 },
								headingProperties: { class: classes.heading },
							}],
							[section as any, { properties: { className: undefined } }],
							[rehypeAccessibleEmojis],
							[rehypeDownloadAttribute],
							[rehypeMinifyWhitespace],
							[rehypeTruncate, { maxChars: 200, disable: !truncated }],
						],
					},
				}}
			/>
		</div>
	);
}
export default Markdown;
