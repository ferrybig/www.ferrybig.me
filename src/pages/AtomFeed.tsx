import { DateTime } from 'luxon';
import { blog } from '.';
import Output from '../components/Output';
import { createElement } from '../jsx/jsx-runtime';
import PageBase, { fullPath } from '../PageBase';
import ContentDefinition from '../types/ContentDefinition';

interface Props {
	base: PageBase,
	slice: ContentDefinition[],
	title: string,
	linkMain: string,
	linkSelf: string,
}

export default function AtomFeed({ base, slice, title, linkMain, linkSelf }: Props) {
	return (
		<Output format="xml">
			{createElement('feed', {
				xmlns: 'http://www.w3.org/2005/Atom',
			}, [
				createElement('title', { type: 'text' }, title),
				createElement('link', { href: fullPath(base, linkSelf), rel: 'self'}),
				createElement('link', { href:  fullPath(base, linkMain), rel: 'alternative', type: 'text/html'}),
				base.meta.author ? createElement('author', {}, [
					createElement('name', {}, base.meta.author),
				]) : null,
				createElement('updated', {}, slice.reduce((a, b) => a < b.updated ? b.updated : a, DateTime.fromMillis(0)).toISO()),
				slice.map(content => createElement('entry', {}, [
					createElement('id', {}, content.slug),
					createElement('title', { type: 'text' }, content.title),
					createElement('link', { href: fullPath(base, blog.toPath({slug: content.slug }))}),
					createElement('published', {}, content.created.toISO()),
					createElement('updated', {}, content.updated.toISO()),
					createElement(content.summaryIsShorterThanBody ? 'summary' : 'content', { type: 'xhtml' }, [
						createElement('div', { xmlns: 'http://www.w3.org/1999/xhtml', dangerouslySetInnerHTML: { __html: content.summaryXml }}),
					]),
				])),
			])}
		</Output>
	);
}
