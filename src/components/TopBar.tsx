import JobTitle from './JobTitle';
import Logo from './Logo';
import Nav from './Nav';
import StyleWrapper from './StyleWrapper';
import ThemeSwitcher from './ThemeSwitcher';
import classes from './TopBar.module.css';

export default function TopBar() {
	return (
		<StyleWrapper as="header" top="primary" bottom="primary" className={classes.root}>
			<div className={classes.decorativeBackground}/>
			<a href="#main" className={classes.skip}>Skip to main content</a>
			<Logo className={classes.logo}/>
			<JobTitle className={classes.jobTitle}/>
			<Nav className={classes.nav}/>
			<ThemeSwitcher className={classes.themeSwitcher}/>
		</StyleWrapper>
	);
}
