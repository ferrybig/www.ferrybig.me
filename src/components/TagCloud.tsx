import Link from './Link';
import classes from './TagCloud.module.css';
import { tag as tagRoute} from '../pages';
import { TagCloudHit } from '../content';
import titleCase from '../utils/titleCase';

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
	tagCloudHits: TagCloudHit[],
}

export default function TagCloud({ tagCloudHits }: Props) {
	return (
		<div className={classes.tagCloud}>
			<ul>
				{tagCloudHits.map(({ count, name }) => (
					<li>
						<Link
							route={tagRoute}
							props={{ tag: name, page: '' }}
							className={classForCount(count)}
							aria-label={`View ${count} article${count !== 1 ? 's' : ''} under the tag ${name.replace('-', '')}`}
						>
							<span>{titleCase(name.replace('-', ''))}</span>
							<span>
								{count} ×
							</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
