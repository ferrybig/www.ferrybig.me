import Fragment from './Fragment';
import PageWrapper from './PageWrapper';
import SrOnly from './SrOnly';
import { JSXNode } from '../jsx/jsx-runtime';
import PageBase, { fullPath } from '../PageBase';
import ContentDefinition from '../types/ContentDefinition';
import classes from './Feed.module.css';
import SrHidden from './SrHidden';
import Markdown from './Markdown';
import Link from './Link';
import { blog } from '../pages';
import Breadcrumb from './Breadcrumb';
import TagList from './TagList';
import Time from './Time';

interface PaginationProps {
	page: number,
	pages: number,
	toPath: (page: string) => string,
}

function Pagination({toPath, page, pages}: PaginationProps): JSX.Element | null {
	const children: JSX.Element[] = [];
	if (page < 4) {
		for (let i = 1; i < page; i++) {
			children.push(
				<li className={classes.paginationNumbers}><a data-instant href={toPath(i === 1 ? '' : `${i}`)}><SrOnly>page </SrOnly>{i}</a></li>
			);
		}
	} else {
		children.push(
			<li className={classes.paginationNumbers}><span>…</span></li>
		);
		for (let i = page - 2; i < page; i++) {
			children.push(
				<li className={classes.paginationNumbers}><a data-instant href={toPath(i === 1 ? '' : `${i}`)}><SrOnly>page </SrOnly>{i}</a></li>
			);
		}
	}
	children.push(
		<li className={classes.paginationNumbers}><a data-instant href={toPath(page === 1 ? '' : `${page}`)} aria-current="page"><SrOnly>page </SrOnly>{page}</a></li>
	);
	if (page > pages - 3) {
		for (let i = page + 1; i <= pages; i++) {
			children.push(
				<li className={classes.paginationNumbers}><a data-instant href={toPath(i === 1 ? '' : `${i}`)}><SrOnly>page </SrOnly>{i}</a></li>
			);
		}
	} else {
		for (let i = page + 1; i < page + 3; i++) {
			children.push(
				<li className={classes.paginationNumbers}><a data-instant href={toPath(i === 1 ? '' : `${i}`)}><SrOnly>page </SrOnly>{i}</a></li>
			);
		}
		children.push(
			<li className={classes.paginationNumbers}><span>…</span></li>
		);
	}
	return (
		<Fragment>
			{children}
		</Fragment>
	);
}

interface FullPaginationProps {
	base: PageBase,
	self: string,
	children: JSXNode,
	className: string,
	'aria-hidden'?: boolean,
}

function FullPagination({base, self, children, 'aria-hidden': ariaHidden = false, className}: FullPaginationProps) {
	return (base.link.first || base.link.previous || base.link.next || base.link.last) ? (
		<nav aria-hidden={ariaHidden} className={className}>
			<ul>
				{base.link.first && base.link.first != self && <li><a data-instant href={base.link.first}>
					<SrHidden>«</SrHidden>
					<SrOnly>first page</SrOnly>
				</a></li>}
				{base.link.previous && <li><a data-instant href={base.link.previous}>
					<SrHidden>&lt;</SrHidden>
					<SrOnly>previous page</SrOnly>
				</a></li>}
				{children}
				{base.link.next && <li><a data-instant href={base.link.next}>
					<SrHidden>&gt;</SrHidden>
					<SrOnly>next page</SrOnly>
				</a></li>}
				{base.link.last && base.link.last != self && <li><a data-instant href={base.link.last}>
					<SrHidden>»</SrHidden>
					<SrOnly>last page</SrOnly>
				</a></li>}
			</ul>
		</nav>
	) : null;
}

interface Props {
	base: PageBase,
	slice: ContentDefinition[],
	pagination?: () => JSXNode,
	page: number,
	pages: number,
	count?: number,
	toPath: (page: string) => string,
	children?: JSXNode
	title: string,
	next?: string | null,
	previous?: string | null,
	first?: string | null,
	last?: string | null,
	atomFeed?: string | null,
}

export default function Feed({ base: oldBase, page, pages, title, children, slice, toPath, next, previous, first, last, pagination, atomFeed }: Props) {
	const base: PageBase = {
		...oldBase,
		link: pages === 1 && !first ? oldBase.link : {
			...oldBase.link,
			first:
				first ? first :
				toPath(''),
			previous:
				previous ? previous :
				page === 1 ? null :
				page === 2 ? toPath('') :
				toPath(`${page - 1}`),
			next:
				next ? next :
				page === pages ? null :
				toPath(`${page + 1}`),
			last:
				last ? last :
				toPath(`${pages}`),
			'og:url': fullPath(oldBase, toPath('')),
		},
		head: [
			...oldBase.head,
			...(atomFeed ? [
				<link href={atomFeed} rel="alternate" type="application/atom+xml"/>,
			] : []),
		],
	};
	const self = toPath(page === 1 ? '' : `${page}`);
	return (
		<PageWrapper
			base={base}
			title={page === 1 ? title : `${title} - Page ${page}`}
			includeWrapper
			topWrapper={
				<Breadcrumb links={[
					toPath('') === '/' ? null : [title, base.link.first ?? self],
					page === 1 ? null : [`Page ${page}`, toPath(`${page}`)],
				]}/>
			}
		>
			<h1>{title}{page === 1 ? '' : ` - Page ${page}`}</h1>
			{children}
			<section>
				<h1 id="articles">
					Articles
				</h1>
				{atomFeed && (
					<p>
						<a href={atomFeed} target="_blank" rel="noopener noreferrer" type="application/atom+xml" className={classes.feed}>
							View articles via an atom feed reader
						</a>
					</p>
				)}
				<FullPagination base={base} self={self} aria-hidden className={classes.pagination}>
					{pagination ? pagination() : <Pagination
						toPath={toPath}
						page={page}
						pages={pages}
					/>}
				</FullPagination>
				<div>
					{slice.map(content => (
						<article className={classes.feedArticle}>
							<h1>
								<Link route={blog} props={{ slug: content.slug }} plain>
									{content.title}
								</Link>
							</h1>
							<header>
								<p>
									<SrOnly>Dated: </SrOnly><Time dateTime={content.date} format="date"/>
									<br/>
									<TagList tags={content.tags} extraTags={content.extraTags}  />
								</p>
							</header>
							<Markdown content={content.summary}/>
							<p>
								<Link
									route={blog}
									props={{ slug: content.slug }}
									aria-label={(content.summaryIsShorterThanBody ? 'Read more about ' : 'View article about ') + content.title}
									className={classes.readMore}
								>
									{content.summaryIsShorterThanBody ? 'Read more...' : 'View article'}
								</Link>
							</p>
						</article>
					))}
				</div>
				<FullPagination base={base} self={self} className={classes.paginationBorder}>
					{pagination ? pagination() : <Pagination
						toPath={toPath}
						page={page}
						pages={pages}
					/>}
				</FullPagination>
			</section>
		</PageWrapper>
	);
}
