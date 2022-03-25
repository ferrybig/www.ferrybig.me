import classNames from 'classnames';
import * as routes from '../pages';
import LiLink from './LiLink';
import classes from './Nav.module.css';

interface Props {
	className: string,
}

export default function Nav({ className }: Props) {
	return (
		<nav aria-label="Primary" className={classNames(classes.root, className)}>
			<ul>
				<LiLink linkClassName={classes.link} route={routes.tag} props={{ tag: 'blog', page: '' }}>Blog</LiLink>
				<LiLink linkClassName={classes.link} route={routes.tag} props={{ tag: 'tech-demo', page: '' }}>Tech-Demo</LiLink>
				<LiLink linkClassName={classes.link} route={routes.tag} props={{ tag: 'things', page: '' }}>Things</LiLink>
				<LiLink linkClassName={classes.link} route={routes.tag} props={{ tag: 'electronics', page: '' }}>Electronics</LiLink>
				<LiLink linkClassName={classes.link} route={routes.tag} props={{ tag: 'career', page: '' }}>Career</LiLink>
			</ul>
		</nav>
	);
}
