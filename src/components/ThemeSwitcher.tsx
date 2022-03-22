import classNames from 'classnames';
import classes from './ThemeSwitcher.module.css';

interface Props {
	className: string,
}

export default function ThemeSwitcher({ className }: Props) {
	return (
		<div id="theme-switcher" className={classNames(classes.root, className)} data-class-selected={classes.selected} data-class-unhide={classes.unhide}>
			<span className={classes.title}>Theme:</span>
			<div className={classes.buttons}>
				<button className={classes.light} data-theme="light" title="Use light theme">light</button>
				<button className={classes.auto} data-theme="auto" title="Use automatic theme selection">automatic</button>
				<button className={classes.dark} data-theme="dark" title="Use dark theme">dark</button>
			</div>
		</div>
	)
}
