import JobTitle from './JobTitle';
import Logo from './Logo';
import Nav from './Nav';
import StyleWrapper from './StyleWrapper';
import ThemeSwitcher from './ThemeSwitcher';
import classes from './TopBar.module.css'

export default function() {
	return (
		<StyleWrapper as="header" top="primary" bottom="primary" className={classes.root}>
			<Logo className={classes.logo}/>
			<JobTitle className={classes.jobTitle}/>
			<Nav className={classes.nav}/>
			<ThemeSwitcher className={classes.themeSwitcher}/>
		</StyleWrapper>
	)
}
