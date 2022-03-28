import { byPeriod, blog } from '.';
import Breadcrumb from '../components/Breadcrumb';
import Markdown from '../components/Markdown';
import PageWrapper from '../components/PageWrapper';
import TagList from '../components/TagList';
import Time from '../components/Time';
import PageBase from '../PageBase';
import ContentDefinition from '../types/ContentDefinition';
import classes from './Content.module.css';

interface Props {
	base: PageBase,
	content: ContentDefinition,
}

export default function Content({ content, base }: Props) {
	return (
		<PageWrapper base={base} title={content.title} includeWrapper topWrapper={
			<Breadcrumb links={[
				[content.date.toLocaleString({ year: 'numeric', month: 'long' }), byPeriod.toPath({
					year: `${content.date.year}`,
					month: `${content.date.month}`,
				})],
				[content.title, blog.toPath({
					slug: content.slug
				})]
			]}/>
		}>
			<header>
				<p className={classes.pageInfo}>
					<span>Created: <Time dateTime={content.date} format="date"/><br/></span>
					{content.endDate && <span>Ended: <Time dateTime={content.endDate} format="date"/><br/></span>}
					<span>Published: <Time dateTime={content.created} format="date-time"/><br/></span>
					{content.created !== content.updated && <span>Updated: <Time dateTime={content.updated} format="date-time"/></span>}
				</p>
				<p>
					<TagList tags={content.tags} extraTags={content.extraTags} />
				</p>
			</header>
			<h1>{content.title}</h1>
			<Markdown
				content={content.body}
			/>
		</PageWrapper>
	);
}
