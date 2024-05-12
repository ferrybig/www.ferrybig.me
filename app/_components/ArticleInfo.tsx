import { getMetadataBySlug } from '@/content';
import classes from './ArticleInfo.module.css';
import Date from './Date';
import Link from 'next/link';
import TagList from './TagList';
import { CONTENT_FOLDER, GIT_BRANCH } from '@/metadata';
interface ArticleInfo {
	date: string | null,
	tags: string[],
	readingTimeMin: number,
	readingTimeMax: number,
	updatedAt: string | null,
	originalFile: string | null,
}
function ArticleInfo({
	date,
	tags,
	readingTimeMin,
	readingTimeMax,
	updatedAt,
	originalFile,
}: ArticleInfo) {
	return (
		<div className={classes.root}>
			<h2 className={classes.title}>Article information</h2>
			{date && <p className={classes.listItem}>
				<strong>Published on:</strong>
				{' '}
				<Date timestamp={date}/>
			</p>}
			{updatedAt && <p className={classes.listItem}>
				<strong>Last update:</strong>
				{' '}
				<Date timestamp={updatedAt}/>
			</p>}
			<p className={classes.listItem}>
				<strong>Reading time:</strong>
				{' '}
				{readingTimeMin}{readingTimeMin !== readingTimeMax ? ` - ${readingTimeMax}` : ''}
				{' '}
				minute
				{readingTimeMax !== 1 ? 's' : ''}
			</p>
			<p className={classes.listItem}>
				<strong>Tools:</strong>
				{' '}
				<a href={`https://github.com/ferrybig/www.ferrybig.me/commits/${GIT_BRANCH}${CONTENT_FOLDER}${originalFile}`}>View source</a>
				{' '}
				<a href={`https://github.com/ferrybig/www.ferrybig.me/edit/${GIT_BRANCH}${CONTENT_FOLDER}${originalFile}`}>Suggest edit</a>
			</p>
			<TagList tags={tags}/>
		</div>
	);
}
export default ArticleInfo;
