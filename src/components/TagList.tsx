import SrOnly from "./SrOnly"
import {tag as tagRoute} from '../pages'
import Link from "./Link";
import classes from "./TagList.module.css";
import SrHidden from "./SrHidden";

interface Props {
	tags: string[]
}

export default function TagList({ tags }: Props) {
	return (
		<span className={classes.root}>
			<SrHidden>Tagged: </SrHidden>
			<SrOnly>This article has been posted under the following categories:</SrOnly>
			{tags.map((tag, index, { length }) => [
				<SrOnly>
					{index == 0 ? ' ' :
					index === length - 1 ? ' and ' :
					', '}
				</SrOnly>,
				<Link route={tagRoute} props={{ tag, page: '' }} >
					{tag}
				</Link>
			])}
		</span>
	);
}
