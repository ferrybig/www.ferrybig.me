import classNames from 'classnames';
import * as routes from '../pages';
import Link from './Link';
import classes from './Nav.module.css';

interface Props {
	className: string,
}

export default function Nav({ className }: Props) {
	return (
		<nav aria-label="Primary" className={classNames(classes.root, className)}>
			<ul>
				<li><Link className={classes.link} route={routes.tag} props={{ tag: 'blog', page: '' }}>Blog</Link></li>
				<li><Link className={classes.link} route={routes.tag} props={{ tag: 'tech-demo', page: '' }}>Tech-Demo</Link></li>
				<li><Link className={classes.link} route={routes.tag} props={{ tag: 'things', page: '' }}>Things</Link></li>
				<li><Link className={classes.link} route={routes.tag} props={{ tag: 'career', page: '' }}>Career</Link></li>
			</ul>
		</nav>
	);
}
