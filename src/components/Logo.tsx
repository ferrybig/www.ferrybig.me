import classNames from 'classnames';
import face from '../images/face.jpg';
import faceWebp from '../images/face.jpg?sizes[]=67,sizes[]=135,sizes[]=270&format=webp&useResponsiveLoader=true';

import Link from './Link';
import { home } from '../pages';
import classes from './Logo.module.css';
import SrOnly from './SrOnly';

interface Props {
	className: string,
}

export default function Logo({ className }: Props) {
	return (
		<Link route={home} props={{ page: '' }} className={classNames(className, classes.root)}>
			<picture>
				<source srcSet={faceWebp.srcSet} type='image/webp'/>
				<img src={face} width={135} height={185} alt=""/>
			</picture>
			<SrOnly>Go back to the homepage</SrOnly>
		</Link>
	);
}
