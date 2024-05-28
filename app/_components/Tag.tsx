import Link from 'next/link';
import classes from './Tag.module.css';
import { getMetadataBySlug } from '@/content';
import Image from '@/_components/Image';
interface Tag {
	slug: string,
}
function Tag({ slug }: Tag) {
	const { linkTitle, color, icon } = getMetadataBySlug(slug);
	return (
		<Link href={'/' + slug} className={classes[color ?? 'root']} >
			{icon && <Image src={icon} width={16} height={16} alt="" className={classes.icon} fetchPriority="low"/>}
			{linkTitle.toLowerCase()}
		</Link>
	);
}
export default Tag;
