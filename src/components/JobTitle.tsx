import classNames from 'classnames';
import classes from './JobTitle.module.css';

interface Props {
	className: string,
}

export default function JobTitle({ className }: Props) {
	return (
		<p className={classNames(classes.root, className)}>
			<span>I am Fernando&nbsp;van&nbsp;Loenhout</span>
			<br/>
			<span className={classes.roleClicker} id="role-clicker">
				<span className={classes.titleFirst}>A </span>
				<span className={classes.titleSecond}>Full stack</span>
				<span className={classes.titleThird}> developer!</span>
			</span>
		</p>
	);
}
