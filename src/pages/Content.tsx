import { byYear, byMonth, blog } from '.';
import Breadcrumb from '../components/Breadcrumb';
import Markdown from '../components/Markdown';
import PageWrapper from '../components/PageWrapper';
import Time from '../components/Time';
import PageBase from '../PageBase';
import ContentDefinition from '../types/ContentDefinition';

const monthNames = [
	'January', 'February', 'March',
	'April', 'May', 'June',
	'July', 'August', 'September',
	'October', 'November', 'December'
];

interface Props {
	base: PageBase,
	content: ContentDefinition,
}

export default function Content({ content, base }: Props) {
	return (
		<PageWrapper base={base} title={content.title}>
			<Breadcrumb links={[
				[`${content.date.year}`, byYear.toPath({
					year: `${content.date.year}`,
					page: '',
				})],
				[monthNames[content.date.month - 1], byMonth.toPath({
					year: `${content.date.year}`,
					month: `${content.date.month}`,
					page: '',
				})],
				[content.title, blog.toPath({
					slug: content.slug
				})]
			]}/>
			<pre>{JSON.stringify(content, null, 4)}</pre>
			<article>
				<header>
					<p>
						<span>Created: <Time dateTime={content.date} format="date"/><br/></span>
						{content.endDate && <span>Ended: <Time dateTime={content.endDate} format="date"/><br/></span>}
						<span>Published: <Time dateTime={content.created} format="date-time"/><br/></span>
						{content.created !== content.updated && <span>Updated: <Time dateTime={content.updated} format="date-time"/></span>}
					</p>
				</header>
				<Markdown
					title={content.title}
					content={content.body}
				/>
			</article>
		</PageWrapper>
	);
}
