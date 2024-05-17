import { MouseEventHandler } from 'react';
import classes from './NavIcon.module.css';
import Image, { StaticImageData } from '@/_components/Image';
interface NavIcon {
	onClick?: MouseEventHandler | undefined,
	href?: string | undefined,
	title?: string | undefined,
	src: StaticImageData
	alt: string
	active?: boolean | undefined,
	small?: boolean | undefined,
}

function NavIcon({href, onClick, alt, src, active, title, small}: NavIcon) {
	const size = small ? 24 : 32;
	const img = (

		<Image
			width={size}
			height={size}
			src={src}
			alt={alt}
		/>
	);
	if (onClick) {
		return (
			<button className={active ? classes.active : classes.icon} title={title} onClick={onClick}>
				{img}
			</button>
		);
	} else if (href) {
		return (
			<a className={active ? classes.active : classes.icon} title={title} href={href}>
				{img}
			</a>
		);
	} else {
		return (
			<span className={active ? classes.active : classes.icon} title={title}>
				{img}
			</span>
		);
	}
}
export default NavIcon;
