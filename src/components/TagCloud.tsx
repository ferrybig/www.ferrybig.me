import Link from './Link';
import classes from './TagCloud.module.css';
import {tag as tagRoute} from '../pages';
import Fragment from './Fragment';

function classForCount(count: number) {
	return count <= 1 ? classes.tag1 :
		count <= 2 ? classes.tag2 :
		count <= 4 ? classes.tag3 :
		count <= 8 ? classes.tag4 :
		count <= 16 ? classes.tag5 :
		count <= 32 ? classes.tag6 :
		count <= 64 ? classes.tag7 :
		classes.tag8;
}

interface Props {
	tagCloudHits: [string, number][],
}

export default function TagCloud({ tagCloudHits }: Props) {
	return (
		<div className={classes.tagCloud}>
			<p>Tag cloud</p>
			<ul>
				{tagCloudHits.map(([tag, count]) => (
					<li>
						<Link route={tagRoute} props={{ tag, page: '' }} className={classForCount(count)}>{tag}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
