import Link from 'next/link';
import classes from './Tag.module.css';
import { getMetadataBySlug } from '@/content';
interface Tag {
	slug: string,
}
function Tag({ slug }: Tag) {
	const { linkTitle, color, icon } = getMetadataBySlug(slug);
	return (
		<Link href={'/' + slug} className={classes[color ?? 'root']} >
			{icon && <span className={classes.icon} style={{ maskImage: `url(${icon.src})`}} />}
			{linkTitle.toLowerCase()}
		</Link>
	);
}
export default Tag;
