import SrOnly from './SrOnly';
import {tag as tagRoute} from '../pages';
import Link from './Link';
import classes from './TagList.module.css';

interface Props {
	extraTags: string[]
	tags: string[]
}

export default function TagList({ tags, extraTags }: Props) {
	return (
		<span className={classes.root}>
			<SrOnly>This article has been posted under the following categories:</SrOnly>
			{[...tags, ...extraTags].map((tag, index, { length }) => [
				<SrOnly>
					{index == 0 ? ' ' :
					index === length - 1 ? ' and ' :
					', '}
				</SrOnly>,
				<Link route={tagRoute} props={{ tag, page: '' }} className={extraTags.includes(tag) ? classes.extra : undefined}>
					{tag}
				</Link>
			])}
		</span>
	);
}
