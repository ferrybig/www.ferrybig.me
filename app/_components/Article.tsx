import { Post } from '@/_content';
import classes from './Article.module.css';
import Link from 'next/link';
import Column from './Column';
import Comments from './Comments';
import Markdown from './Markdown';
import Toc from './Toc';
import Date from '@/_components/Date';
import Image from 'next/image';

interface Article {
	post: Post,
}
function Article({post}: Article) {
	return (
		<div className={classes.root}>
			<main className={classes.displayContent}>
				<header className={classes.displayContent}>
					<Column attached="top" className={classes.postInfo}>
						<p>
							<strong>Written by:</strong>
							{' '}
							Fernando
						</p>
						{post.date && <p>
							<strong>Published on:</strong>
							{' '}
							<Date timestamp={post.date}/>
						</p>}
						<p>
							<strong>Last update:</strong>
							{' '}
							<a href={`https://github.com/ferrybig/www.ferrybig.me/commits/master/${post.filename}`}><Date timestamp={post.updatedAt}/></a>
						</p>
						<p>
							<strong>Reading time:</strong>
							{' '}
							{post.readingTimeMin}{post.readingTimeMin !== post.readingTimeMax ? ` - ${post.readingTimeMax}` : ''}
							{' '}
							minute
							{post.readingTimeMax !== 1 ? 's' : ''}
						</p>
						<ul>
							{post.tags.map(tag => <li key={tag.slug}><Link href={`/${tag.slug}`}>{tag.title}</Link></li>)}
						</ul>
					</Column>
					<div className={classes.toc}>
						<Column attached="left" sticky>
							<Toc id="nav" entries={[
								...post.tableOfContents,
								{
									lvl: 1,
									slug: 'article-comments',
									title: 'Comments',
								},
							]}/>
						</Column>
					</div>
				</header>
				<Column className={classes.content} id="main">
					<Markdown
						source={post.markdown}
						filename={post.filename}
						beforeHeading={
							post.thumbnail ? (
								post.thumbnail.embed === 'iframe' && post.thumbnail.link ? (
									<div className={classes.hero} style={{backgroundImage: `url('${post.thumbnail.image}')`}}>
										<Image hidden src={post.thumbnail.image} width={939} height={528} alt={post.thumbnail.alt ?? ''} fetchPriority="low"/>
										<iframe src={post.thumbnail.link}/>
										{post.thumbnail.alt && (
											<a className={classes.caption} href={post.thumbnail.link}>{post.thumbnail.alt}</a>
										)}
									</div>
								) : post.thumbnail.link ? (
									<a href={post.thumbnail.link} className={classes.hero} style={{backgroundImage: `url('${post.thumbnail.image}')`}}>
										<Image src={post.thumbnail.image} width={939} height={528} alt={post.thumbnail.alt ?? ''} loading="eager" fetchPriority="auto"/>
										{post.thumbnail.alt && (
											<span className={classes.caption}>{post.thumbnail.alt}</span>
										)}
									</a>
								) : (
									<div className={classes.hero} style={{backgroundImage: `url('${post.thumbnail.image}')`}}>
										<Image src={post.thumbnail.image} width={939} height={528} alt={post.thumbnail.alt ?? ''} loading="eager" fetchPriority="auto"/>
									</div>
								)
							) : null
						}
					/>
				</Column>
				<footer className={classes.displayContent}>
					<Column attached="top" className={classes.share}>
						<p>
							Share article:
						</p>
					</Column>
					<Column className={classes.comments}>
						<h2 id="article-comments" className={classes.sectionHeading}>Comments</h2>
						<Comments/>
					</Column>
				</footer>
			</main>
			<aside className={classes.moreReading}>
				<Column margin>
					<h2 className={classes.sectionHeading}>More {post.mainTag.slug}</h2>
					<nav>
						<ul>
							{post.mainTag.posts.map(p => p.hiddenFromTags ? null : (
								<li key={p.mainTag.slug + '/' + p.slug}>
									<Link href={'/' + p.mainTag.slug + '/' + p.slug} aria-current={post === p}>
										{p.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</Column>
			</aside>
		</div>
	);
}
export default Article;
