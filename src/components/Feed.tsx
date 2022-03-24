import Fragment from "./Fragment";
import Markdown from "./Markdown";
import PageWrapper from "./PageWrapper";
import SrOnly from "./SrOnly";
import StyleWrapper from "./StyleWrapper";
import { JSXNode } from "../jsx/jsx-runtime";
import PageBase from "../PageBase";
import ContentDefinition from "../types/ContentDefinition";
import classes from "./Feed.module.css";

interface PaginationProps {
	page: number,
	pages: number,
	toPath: (page: string) => string,
}

// https://mdn.github.io/css-examples/css-cookbook/pagination.html
function Pagination({toPath, page, pages}: PaginationProps): JSX.Element | null {
	const children: JSX.Element[] = [];
	if (page < 4) {
		for(let i = 1; i < page; i++) {
			children.push(
				<li><a data-instant href={toPath(i === 1 ? '' : `${i}`)}><SrOnly>page </SrOnly>{i}</a></li>
			); 
		}
	} else {
		children.push(
			<li>...</li>
		)
		for(let i = page - 3; i < page; i++) {
			children.push(
				<li><a data-instant href={toPath(i === 1 ? '' : `${i}`)}><SrOnly>page </SrOnly>{i}</a></li>
			); 
		}
	}
	children.push(
		<li><a data-instant href={toPath(page === 1 ? '' : `${page}`)} aria-current="page"><SrOnly>page </SrOnly>{i}</a></li>
	)
}

interface Props {
	base: PageBase,
	slice: ContentDefinition[],
	page: number,
	pages: number,
	toPath: (page: string) => string,
	children: JSXNode
	title: string,
	next: string | null,
	previous: string | null,
	first: string | null,
	last: string | null,
}

export default function Feed({ base: oldBase, page, pages, title, children, slice, toPath, next, previous, first, last }: Props) {
	const base = {
		...oldBase,
		link: pages === 1 || first ? oldBase.link : {
			...oldBase.link,
			first: first ? first : toPath(''),
			previous: previous ? previous : page === 1 ? null : page === 2 ? toPath('') : toPath(`${page - 1}`),
			next: next ? next : page === pages ? null : toPath(`${page + 1}`),
			last: last ? last : toPath(`${pages}`),
			'og:url': toPath(''),
		},
	};
	return (
		<PageWrapper
			base={base}
			title={page === 1 ? title : `${title} - page ${page}`}
			outer='secondary'
			inner='base'
			bottomOuter='secondary'
			bottomInner='base'
		>
			<StyleWrapper top="secondary" topInner='base' bottom="secondary" bottomInner='base'>
				{children ? (
					children
				) : (
					<h1>{title} - Page ${page}</h1>
				)}
				<h2 id="articles">Articles</h2>
				{slice.map(e => (
					<article>
						<h1>{e.title}</h1>

					</article>
				))}
				{base.link.first || base.link.previous || base.link.next || base.link.last && (
					<nav aria-label="pagination">
						<ul>
							{base.link.first && <li><a data-instant href={base.link.first}>
								<span aria-hidden="true">«</span>
								<SrOnly>first page</SrOnly>
							</a></li>}
							{base.link.previous && <li><a data-instant href={base.link.previous}>
								<span aria-hidden="true">&lt;</span>
								<SrOnly>previous page</SrOnly>
							</a></li>}
							<Pagination/>
						</ul>
					</nav>
				)}
			</StyleWrapper>
		</PageWrapper>
	)
}
