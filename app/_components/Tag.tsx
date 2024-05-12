import Link from 'next/link';
import classes from './Tag.module.css';
import { getMetadataBySlug } from '@/content';
import Image from 'next/image';
interface Tag {
	slug: string,
}
function Tag({ slug }: Tag) {
	const { title, color, icon } = getMetadataBySlug(slug);
	return (
		<Link href={slug} className={classes[color ?? 'root']} >
			{icon && <Image src={icon} width={16} height={16} alt={title} className={classes.icon}/>}
			{title}
		</Link>
	);
}
export default Tag;
