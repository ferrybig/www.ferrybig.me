import { ArticleWrapperProps, MetaData, getChildrenBySlug, getMetadataBySlug } from '@/content';
import { generateFeeds } from './feed';
import Link from 'next/link';
import Column from './Column';
import Comments from './Comments';
import Toc from './Toc';
import Image from 'next/image';
import Date from './Date';
import classes from './ArticleWrapper.module.css';
import HtmlPreview from './HtmlPreview';
import { Metadata } from 'next';
import { SITE_URL } from '@/metadata';
import ArticleInfo from './ArticleInfo';

function isRelative(href: string): boolean {
	return !/^(?:[a-z]+:)?\/\//i.test(href);
}

export function generateFeed(metadata: MetaData | null, children: MetaData[], format: 'atom' | 'json' | 'rss') {
	return generateFeeds({
		format: format,
		posts: children,
		subDirectory: metadata?.slug ?? '',
		title: 'Posts under ' + (metadata ? metadata.title : 'www.ferrybig.me'),
	});
}
export function generateMetadata({
	slug,
	feeds,
	metadata: {
		title,
		tags,
		thumbnail,
	},
}: ArticleWrapperProps): Metadata | Promise<Metadata> {
	return {
		metadataBase: new URL(SITE_URL),
		title: title,
		keywords: tags,
		openGraph: {
			type: 'article',
			tags: tags,
			images: thumbnail ? [thumbnail.image.src] : [],
		},
		alternates: {
			canonical: slug,
			types: feeds ? {
				'application/rss+xml': 'rss.xml',
				'application/atom+xml': 'atom.xml',
				'application/feed+json': 'feed.json',
			} : {},
		},
		other: {
			'giscus:backlink': slug,
		},
		authors: [
			{
				name: 'Fernando',
				url: 'https://ferrybig.me',
			},
		],
		formatDetection: {
			address: false,
			date: false,
			email: false,
			telephone: false,
			url: false,
		},
	};
}
export default function ArticleWrapper({
	metadata: {
		slug,
		date,
		tags,
		thumbnail,
		updatedAt,
		readingTimeMin,
		readingTimeMax,
		commentStatus,
	},
	toc,
	factory,
	originalFile,
	children,
}: ArticleWrapperProps) {

	return (
		<div className={classes.root}>
			<main className={classes.displayContent}>
				<header className={classes.info}>
					<Column attached="top" className={classes.meInfo} margin>
						<p>I&apos;m Fernando, <br/>a full stack developer</p>
					</Column>
					<Column attached="right" flatten="bottom" className={classes.postInfo}>
						<ArticleInfo
							date={date}
							originalFile={originalFile}
							readingTimeMax={readingTimeMax}
							readingTimeMin={readingTimeMin}
							tags={tags}
							updatedAt={updatedAt}
						/>
					</Column>
					<Column flatten="top" className={classes.toc} attached={readingTimeMax > 1 || thumbnail ? 'right' : undefined} sticky flex>
						<Toc id="nav" entries={[
							...toc,
							...(children.length > 0 ? [
								{
									lvl: 1,
									slug: 'article-pages',
									title: 'Articles under this topic',
								},
							] : []),
							{
								lvl: 1,
								slug: 'article-comments',
								title: 'Comments',
							},
						]}/>
					</Column>
				</header>
				<div className={classes.content}>
					{factory && <Column className={classes.markdown} id="main" margin={children.length > 0}>
						{factory?.({
							components: {
								h1: (props) => (
									<>
										{thumbnail ? (
											thumbnail.embed ? (
												<div className={classes.hero} style={{backgroundImage: `url('${thumbnail.image.src}')`}}>
													<Image hidden src={thumbnail.image} width={939} height={528} alt={thumbnail.alt ?? ''} fetchPriority="low"/>
													<iframe src={thumbnail.embed}/>
													{thumbnail.alt && thumbnail.link && (
														<a className={classes.caption} href={thumbnail.link}>{thumbnail.alt}</a>
													)}
												</div>
											) : thumbnail.link ? (
												<a href={thumbnail.link} className={classes.hero} style={{backgroundImage: `url('${thumbnail.image.src}`}}>
													<Image src={thumbnail.image} width={939} height={528} alt={thumbnail.alt ?? ''} loading="eager" fetchPriority="auto"/>
													{thumbnail.alt && (
														<span className={classes.caption}>{thumbnail.alt}</span>
													)}
												</a>
											) : (
												<div className={classes.hero} style={{backgroundImage: `url('${thumbnail.image.src}')`}}>
													<Image src={thumbnail.image} width={939} height={528} alt={thumbnail.alt ?? ''} loading="eager" fetchPriority="auto"/>
												</div>
											)
										) : null}
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
							},
						})}
					</Column>}
					{children.length > 0 && <Column className={classes.children} padded>
						<h1 id="article-pages" className={classes.sectionHeading}>Articles under this topic</h1>
						{children.map((child) => (
							<div key={child.slug} className={classes.child}>
								<h2><Link href={'/' + child.slug}>{child.title}</Link></h2>
								<p>{child.date && <Date timestamp={child.date}/>}</p>
							</div>
						))}
					</Column>}
				</div>
				{commentStatus !== 'disabled' && <footer className={classes.displayContent}>
					<Column className={classes.comments}>
						<h1 id="article-comments" className={classes.sectionHeading}>Comments</h1>
						<Comments/>
					</Column>
				</footer>}
			</main>
			{tags.length > 0 && (
				<aside className={classes.moreReading}>
					<Column margin>
						<h1 className={classes.sectionHeading}>More {getMetadataBySlug(tags[0]).title}</h1>
						<nav>
							<ul>
								{getChildrenBySlug(tags[0]).reverse().map(p =>
									<li key={p.slug}>
										<Link href={'/' + p.slug} aria-current={slug === p.slug}>
											{p.title}
										</Link>
									</li>
								)}
							</ul>
						</nav>
					</Column>
				</aside>
			)}
		</div>
	);
}
