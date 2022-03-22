import { DateTime } from 'luxon';
import { byYear, byMonth, blog } from '.';
import Breadcrumb from '../components/Breadcrumb';
import Markdown from '../components/Markdown';
import PageWrapper from '../components/PageWrapper';
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
				[content.date.substring(0, 4), byYear.toPath({
					year: content.date.substring(0, 4)
				})],
				[monthNames[Number.parseInt(content.date.substring(5, 7), 10) - 1], byMonth.toPath({
					year: content.date.substring(0, 4),
					month: content.date.substring(5, 7),
				})],
				[content.title, blog.toPath({
					slug: content.slug
				})]
			]}/>
			<pre>{JSON.stringify(content, null, 4)}</pre>
			<article>
				<header>
					<p>
						<span>Created: <time dateTime={DateTime.fromISO(content.date).toISO()} title={content.date}>
							{DateTime.fromISO(content.date).toLocaleString({ dateStyle: 'long'})}
						</time><br/></span>
						{content.endDate && <span>Ended<time dateTime={content.endDate} title={content.endDate}>
							{DateTime.fromISO(content.endDate).toLocaleString({ dateStyle: 'long'})}
						</time><br/></span>}
						<span>Published: <time dateTime={DateTime.fromRFC2822(content.created).toISO()} title={DateTime.fromRFC2822(content.created).toISO()}>
							{DateTime.fromRFC2822(content.created).toLocaleString({ dateStyle: 'long', timeStyle: 'short', hour12: false })}
						</time><br/></span>
						{content.updated !== content.updated && <span>Updated: <time dateTime={DateTime.fromRFC2822(content.updated).toISO()} title={DateTime.fromRFC2822(content.updated).toISO()}>
							{DateTime.fromRFC2822(content.updated).toLocaleString({ dateStyle: 'long', timeStyle: 'short', hour12: false })}
						</time></span>}
					</p>
				</header>
				<Markdown
					title={content.titleHTML}
					content={content.body}
				/>
			</article>
		</PageWrapper>
	);
}
