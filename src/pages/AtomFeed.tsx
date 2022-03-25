import { DateTime } from "luxon";
import { DOMParser } from 'xmldom'
import { blog } from ".";
import Output from "../components/Output";
import { createElement } from "../jsx/jsx-runtime";
import { PartialBase } from "../PageBase";
import ContentDefinition from "../types/ContentDefinition";

function href(base: PartialBase, link: string) {
	return base.site + base.publicPath.substring(1) + link.substring(1);
}

interface Props {
	base: PartialBase,
	slice: ContentDefinition[],
	title: string,
	linkMain: string,
	linkSelf: string,
}

export default function AtomFeed({ base, slice, title, linkMain, linkSelf }: Props) {
	return (
		<Output format="xml">
			{createElement('feed', {
				xmlns: "http://www.w3.org/2005/Atom",
			}, [
				createElement('title', {}, title),
				createElement('link', { href: href(base, linkSelf), rel: 'self'}),
				createElement('link', { href:  href(base, linkMain), rel: "alternative", type: 'text/html'}),
				createElement('author', {}, [
					createElement('name', {}, "Fernando van Loenhout")
				]),
				createElement('updated', {}, slice.reduce((a, b) => a < b.updated ? b.updated : a, DateTime.fromMillis(0)).toISO()),
				slice.map(content => createElement('entry', {}, [
					createElement('id', {}, content.slug),
					createElement('title', {}, content.title),
					createElement('link', { href: href(base, blog.toPath({slug: content.slug }))}),
					createElement('published', {}, content.created.toISO()),
					createElement('updated', {}, content.updated.toISO()),
					createElement('summary', { type: 'xhtml'}, [
						createElement('div', { xmlns: 'http://www.w3.org/1999/xhtml', dangerouslySetInnerHTML: {
							__html: new XMLSerializer().serializeToString(new DOMParser().parseFromString(
								content.body,
								'text/html',
							)),
						}}),
					]),
				])),
			])}
		</Output>
	);
}
