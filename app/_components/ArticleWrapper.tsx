import { ArticleWrapperProps, MetaData, getChildrenBySlug, getMetadataBySlug } from '@/content';
import { generateFeeds } from './feed';
import Link from 'next/link';
import Column from './Column';
import Comments from './Comments';
import Toc from './Toc';
import Image from '@/_components/Image';
import Date from './Date';
import classes from './ArticleWrapper.module.css';
import HtmlPreview from './HtmlPreview';
import { Metadata } from 'next';
import { SITE_URL } from '@/metadata';
import ArticleInfo from './ArticleInfo';
import Heading from './Heading';
import TagList from './TagList';

function isRelative(href: string): boolean {
	return !/^(?:[a-z]+:)?\/\//i.test(href);
}

export function generateFeed(metadata: MetaData | null, children: MetaData[], format: 'atom' | 'json' | 'rss') {
	return generateFeeds({
		format: format,
		posts: children,
		subDirectory: metadata?.slug ?? '',
		title: 'Posts under ' + (metadata?.slug ? metadata.title : 'www.ferrybig.me'),
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
		title,
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
	feeds,
}: ArticleWrapperProps) {
	const shortDisplay = readingTimeMax <= 1 && thumbnail == null;
	return (
		<div className={shortDisplay ? classes.rootShort : classes.root}>
			<header className={classes.displayContent}>
				<Column attached="top" className={classes.meInfo} margin>
					<p>I&apos;m Fernando, <br/>a full stack developer</p>
				</Column>
			</header>
			<main className={classes.displayContent}>
				<header className={classes.displayContent}>
					<Column className={classes.postInfo} attached={shortDisplay ? undefined : 'right'} margin>
						<ArticleInfo
							date={date}
							slug={slug}
							originalFile={originalFile}
							readingTimeMax={readingTimeMax}
							readingTimeMin={readingTimeMin}
							tags={tags}
							updatedAt={updatedAt}
							feeds={feeds}
						/>
					</Column>
					<div className={classes.tocWrapper}>
						<Column className={classes.toc} sticky flex>
							<Toc id="nav" entries={[
								...toc,
								...(children.length > 0 ? [
									{
										lvl: 1,
										slug: 'article-pages',
										title: 'Articles',
									},
								] : []),
								...(commentStatus !== 'disabled' ? [{
									lvl: 1,
									slug: 'article-comments',
									title: 'Comments',
								}] : []),
							]}/>
						</Column>
					</div>
				</header>
				<div className={classes.rightSide}>
					{factory && <Column className={classes.markdown} id="main" margin>
						{factory?.({
							components: {
								h1: (props: any) => (
									<>
										{thumbnail ? (
											thumbnail.link ? (
												<a href={thumbnail.link} className={classes.hero} style={{backgroundImage: `url('${thumbnail.image.blurDataURL}`}}>
													<Image src={thumbnail.image} width={939} height={528} alt={thumbnail.alt ?? ''} decoding="sync" fetchPriority="high"/>
													{thumbnail.alt && (
														<span className={classes.caption}>{thumbnail.alt}</span>
													)}
												</a>
											) : (
												<div className={classes.hero} style={{backgroundImage: `url('${thumbnail.image.blurDataURL}')`}}>
													<Image src={thumbnail.image} width={939} height={528} alt={thumbnail.alt ?? ''} decoding="sync" fetchPriority="high"/>
												</div>
											)
										) : null}
										<Heading level={1} {...props}/>
									</>
								),
								h2: (props: any) => <Heading level={2} {...props}/>,
								h3: (props: any) => <Heading level={3} {...props}/>,
								h4: (props: any) => <Heading level={4} {...props}/>,
								h5: (props: any) => <Heading level={5} {...props}/>,
								h6: (props: any) => <Heading level={6} {...props}/>,
								HtmlPreview,
								img: (props: any) => <Image
									{...props}
									alt={props.alt ?? ''}
									width={props.width ? Number(props.width) : undefined}
									height={props.height ? Number(props.height) : undefined}
									loading="lazy"
								/>,
								a: (props: any) => props.href && isRelative(props.href) ? <Link {...props as any} href={props.href ?? ''}/> : <a {...props}/>,
							},
						})}
					</Column>}
					{children.length > 0 && <section className={classes.children}>
						<Column padded margin>
							<Heading level={1} id="article-pages" className={classes.sectionHeading}>{factory ? 'Articles' : `${title} Articles`}</Heading>
							{children.map((child) => (
								<article key={child.slug} className={classes.child}>
									<Heading level={2} id={`child-${child.slug}`}><Link href={'/' + child.slug} prefetch={false}>{child.title}</Link></Heading>
									<p>{child.date && <Date timestamp={child.date}/>}</p>
									<p>{child.summary}</p>
									<TagList tags={child.tags}/>
								</article>
							))}
						</Column>
					</section>}
					{commentStatus !== 'disabled' && <footer className={classes.displayContent}>
						<Column className={classes.comments} margin>
							<h1 id="article-comments" className={classes.sectionHeading}>Comments</h1>
							<Comments/>
						</Column>
					</footer>}
				</div>
			</main>
			{tags.length > 0 && (
				<aside className={classes.moreReading}>
					<Column>
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
