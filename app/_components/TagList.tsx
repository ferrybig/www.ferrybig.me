import Tag from './Tag';
import classes from './TagList.module.css';
interface TagList  {
	tags: string[]
}
function TagList({ tags }: TagList) {
	return (
		<ul className={classes.root}>
			{tags.map((tag) => (
				<li key={tag}><Tag slug={tag} /></li>
			))}
		</ul>
	);
}
export default TagList;
