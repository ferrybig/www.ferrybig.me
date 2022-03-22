import classNames from 'classnames';
import * as routes from '../pages'
import LiLink from './LiLink';
import classes from './Nav.module.css'

interface Props {
	className: string,
}

export default function Nav({ className }: Props) {
	return (
		<nav className={classNames(classes.root, className)}>
			<ul>
				<LiLink linkClassName={classes.link} children={'Blog'} route={routes.home} props={{}}/>
				<LiLink linkClassName={classes.link} children={'Tech-Demo'} route={routes.home} props={{}}/>
				<LiLink linkClassName={classes.link} children={'Electronics'} route={routes.home} props={{}}/>
				<LiLink linkClassName={classes.link} children={'Carriers'} route={routes.home} props={{}}/>
			</ul>
		</nav>
	);
}
